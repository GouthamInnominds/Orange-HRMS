<?php

/**
 * OrangeHRM is a comprehensive Human Resource Management (HRM) System that captures
 * all the essential functionalities required for any enterprise.
 * Copyright (C) 2006 OrangeHRM Inc., http://www.orangehrm.com
 *
 * OrangeHRM is free software: you can redistribute it and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *
 * OrangeHRM is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with OrangeHRM.
 * If not, see <https://www.gnu.org/licenses/>.
 */

namespace OrangeHRM\Payroll\Service;

use DateTime;
use OrangeHRM\Entity\PayrollEmployeeSnapshot;
use OrangeHRM\Entity\PayrollItem;
use OrangeHRM\Entity\PayrollPayPeriod;
use OrangeHRM\Entity\PayrollRecord;
use OrangeHRM\Entity\PayrollRun;
use OrangeHRM\Entity\SalarySlip;
use OrangeHRM\Entity\User;
use OrangeHRM\ORM\Doctrine;
use OrangeHRM\Payroll\Dao\PayrollPeriodDao;
use OrangeHRM\Payroll\Dao\PayrollRunDao;
use OrangeHRM\Payroll\Exception\PayrollException;
use OrangeHRM\Payroll\Util\Money;

/**
 * Orchestrates idempotent batch calculation & adjustment recalculation for a PayrollRun:
 * PIM Snapshot -> Leave LWP -> Time/Attendance Overtime -> Claim Reservation -> India Statutory Rules -> Draft Slips -> Audit.
 */
class PayrollCalculationService
{
    private ?PayrollConfigService $configService = null;
    private ?PayrollPeriodDao $periodDao = null;
    private ?PayrollRunDao $runDao = null;
    private ?PayrollEmployeeSnapshotService $snapshotService = null;
    private ?LeavePayrollAdapter $leaveAdapter = null;
    private ?TimeAttendancePayrollAdapter $timeAdapter = null;
    private ?OvertimePolicyService $overtimeService = null;
    private ?ClaimSettlementAdapter $claimAdapter = null;
    private ?IndianStatutoryCalculator $statutoryCalculator = null;

    public function getConfigService(): PayrollConfigService
    {
        return $this->configService ??= new PayrollConfigService();
    }

    public function getPeriodDao(): PayrollPeriodDao
    {
        return $this->periodDao ??= new PayrollPeriodDao();
    }

    public function getRunDao(): PayrollRunDao
    {
        return $this->runDao ??= new PayrollRunDao();
    }

    public function getSnapshotService(): PayrollEmployeeSnapshotService
    {
        return $this->snapshotService ??= new PayrollEmployeeSnapshotService();
    }

    public function getLeaveAdapter(): LeavePayrollAdapter
    {
        return $this->leaveAdapter ??= new LeavePayrollAdapter();
    }

    public function getTimeAdapter(): TimeAttendancePayrollAdapter
    {
        return $this->timeAdapter ??= new TimeAttendancePayrollAdapter();
    }

    public function getOvertimeService(): OvertimePolicyService
    {
        return $this->overtimeService ??= new OvertimePolicyService();
    }

    public function getClaimAdapter(): ClaimSettlementAdapter
    {
        return $this->claimAdapter ??= new ClaimSettlementAdapter();
    }

    public function getStatutoryCalculator(): IndianStatutoryCalculator
    {
        return $this->statutoryCalculator ??= new IndianStatutoryCalculator();
    }

    public function calculateRun(int $runId, ?User $actor = null): PayrollRun
    {
        $run = $this->getRunDao()->getRunById($runId);
        if ($run === null) {
            throw new PayrollException(sprintf('Payroll run #%d not found.', $runId), PayrollException::CODE_NOT_FOUND, [], 404);
        }

        if (!in_array($run->getStatus(), [PayrollRun::STATUS_DRAFT, PayrollRun::STATUS_CALCULATED, PayrollRun::STATUS_REJECTED], true)) {
            throw PayrollException::invalidStateTransition($run->getStatus(), PayrollRun::STATUS_CALCULATED);
        }

        $period = $run->getPayPeriod();
        if (in_array($period->getStatus(), [PayrollPayPeriod::STATUS_LOCKED, PayrollPayPeriod::STATUS_CLOSED], true)) {
            throw PayrollException::prerequisiteBlocked(
                sprintf('Pay period "%s" is %s and cannot be calculated.', $period->getName(), $period->getStatus())
            );
        }

        $config = $this->getConfigService()->getConfig($period->getJurisdictionCode());
        $currency = $period->getCurrency()->getId();

        // Validate tax brackets exist before starting transaction
        $defaultBrackets = $this->getConfigService()->getPayrollConfigDao()->getTaxBrackets(
            $period->getFinancialYear(),
            $config->getDefaultTaxRegime(),
            $config->getJurisdictionCode(),
            true
        );
        if (empty($defaultBrackets)) {
            throw PayrollException::prerequisiteBlocked(
                sprintf('No active tax brackets found for FY %s in jurisdiction %s.', $period->getFinancialYear(), $config->getJurisdictionCode())
            );
        }

        $em = Doctrine::getEntityManager();

        return $em->wrapInTransaction(function () use ($em, $run, $period, $config, $currency, $actor): PayrollRun {
            // Release any prior claim locks and delete prior draft calculation artifacts on re-calculate
            $this->getClaimAdapter()->releaseReservationsForRun($run->getId());
            $this->getRunDao()->deleteRunCalculationArtifacts($run->getId());
            $em->flush();

            $snapshots = $this->getSnapshotService()->captureSnapshotsForRun($run, $config);

            $totalEligible = 0;
            $exceptionCount = 0;
            $sumGross = Money::zero($currency);
            $sumDeductions = Money::zero($currency);
            $sumTax = Money::zero($currency);
            $sumReimbursements = Money::zero($currency);
            $sumNetPay = Money::zero($currency);

            foreach ($snapshots as $snapshot) {
                if (!$snapshot->isEligible()) {
                    $exceptionCount++;
                    continue;
                }

                $totalEligible++;
                $employee = $snapshot->getEmployee();
                $empNumber = $employee->getEmpNumber();
                $payload = json_decode($snapshot->getSnapshotPayloadJson(), true) ?: [];
                $profile = $payload['profile'] ?? [];
                $monthlyBase = Money::of($snapshot->getBaseMonthlySalary(), $currency);

                // 1. Leave / LWP impact
                $leaveImpact = $this->getLeaveAdapter()->evaluateLeaveImpact($empNumber, $period, $config, $monthlyBase);

                // 2. Time / Attendance non-double-counted hours & Overtime
                $timeImpact = $this->getTimeAdapter()->evaluateWorkedAndOvertimeHours(
                    $empNumber,
                    $period,
                    $config,
                    $leaveImpact['workingDays']
                );
                $basicPct = (string)($profile['basicPercentOfCtc'] ?? '50.00');
                $nominalMonthlyBasic = $monthlyBase->multiplyPercent($basicPct)->roundHalfUp(2);
                $otImpact = $this->getOvertimeService()->calculateOvertimePay(
                    $nominalMonthlyBasic,
                    $timeImpact['overtimeHours'],
                    $leaveImpact['workingDays'],
                    $config
                );

                // 3. Create initial PayrollRecord row so Claim links can FK-reference it immediately
                $record = new PayrollRecord();
                $record->setPayrollRun($run);
                $record->setPayPeriod($period);
                $record->setEmployee($employee);
                $record->setSnapshot($snapshot);
                $record->setCurrency($period->getCurrency());
                $record->setStatus(PayrollRecord::STATUS_CALCULATED);
                $record->setPaymentStatus(PayrollRecord::PAYMENT_UNPAID);
                $this->getRunDao()->saveRecord($record);

                // 4. Discover & exclusively lock APPROVED Expense Claims in matching period currency
                $claimImpact = $this->getClaimAdapter()->reserveApprovedClaimsForEmployee($empNumber, $run, $record);

                // 5. Fetch YTD prior approved/locked records for exact annual TDS true-up
                $ytdRecords = $this->getRunDao()->getYtdPriorRecordsForEmployee(
                    $empNumber,
                    $period->getFinancialYear(),
                    $run->getId(),
                    $period->getStartDate()
                );
                $ytdTaxable = Money::zero($currency);
                $ytdTdsPaid = Money::zero($currency);
                foreach ($ytdRecords as $yr) {
                    $ytdTaxable = $ytdTaxable->add(Money::of($yr->getGrossSalary(), $currency));
                    $ytdTdsPaid = $ytdTdsPaid->add(Money::of($yr->getTotalTax(), $currency));
                }

                // 6. Execute India Statutory Calculation Engine
                $breakdown = $this->getStatutoryCalculator()->calculateBreakdown(
                    $period,
                    $config,
                    $monthlyBase,
                    $profile,
                    $leaveImpact['lwpDeduction'],
                    $otImpact['overtimePay'],
                    $claimImpact['reimbursementTotal'],
                    $ytdTaxable,
                    $ytdTdsPaid,
                    count($ytdRecords),
                    $employee->getJoinedDate()
                );

                // BR_PAY_002 Negative Net Pay Guard
                if ($breakdown['netSalary']->isNegative()) {
                    throw PayrollException::negativeNetPay($empNumber, $breakdown['netSalary']->toDatabaseString(2));
                }

                // 7. Collect validation warnings
                $warnings = array_merge($leaveImpact['warnings'], $timeImpact['warnings']);
                if (!empty($otImpact['reason'])) {
                    $warnings[] = (string)$otImpact['reason'];
                }
                if (empty($profile['maskedBankAccount'])) {
                    $warnings[] = 'MISSING_BANK_ACCOUNT_DETAILS';
                }
                if (!empty($warnings)) {
                    $exceptionCount++;
                }

                // 8. Persist computed financials on PayrollRecord
                $record->setBasicSalary($breakdown['basicSalary']->toDatabaseString(2));
                $record->setHraAmount($breakdown['hraAmount']->toDatabaseString(2));
                $record->setSpecialAllowance($breakdown['specialAllowance']->toDatabaseString(2));
                $record->setOvertimeAmount($breakdown['overtimeAmount']->toDatabaseString(2));
                $record->setReimbursementAmount($breakdown['reimbursementAmount']->toDatabaseString(2));
                $record->setLwpDeduction($breakdown['lwpDeduction']->toDatabaseString(2));
                $record->setGrossSalary($breakdown['grossSalary']->toDatabaseString(2));
                $record->setTotalAllowance($breakdown['totalAllowance']->toDatabaseString(2));
                $record->setEpfEmployee($breakdown['epfEmployee']->toDatabaseString(2));
                $record->setEpfEmployer($breakdown['epfEmployer']->toDatabaseString(2));
                $record->setEsicEmployee($breakdown['esicEmployee']->toDatabaseString(2));
                $record->setEsicEmployer($breakdown['esicEmployer']->toDatabaseString(2));
                $record->setProfessionalTax($breakdown['professionalTax']->toDatabaseString(2));
                $record->setIncomeTaxTds($breakdown['incomeTaxTds']->toDatabaseString(2));
                $record->setHealthEducationCess($breakdown['healthEducationCess']->toDatabaseString(2));
                $record->setTotalTax($breakdown['totalTax']->toDatabaseString(2));
                $record->setTotalDeduction($breakdown['totalDeduction']->toDatabaseString(2));
                $record->setAdjustmentAmount('0.00');
                $record->setNetSalary($breakdown['netSalary']->toDatabaseString(2));
                $record->setWorkingDays(number_format($leaveImpact['workingDays'], 2, '.', ''));
                $record->setPayableDays(number_format($leaveImpact['payableDays'], 2, '.', ''));
                $record->setLwpDays(number_format($leaveImpact['lwpDays'], 2, '.', ''));
                $record->setOvertimeHours(number_format($timeImpact['overtimeHours'], 2, '.', ''));
                $record->setTaxRegime($breakdown['taxRegime']);
                $record->setValidationWarningsJson(!empty($warnings) ? json_encode(array_values(array_unique($warnings))) : null);

                $this->populateRecordItems($record, $breakdown, $snapshot, $leaveImpact, $timeImpact['sourceUsed']);
                $this->getRunDao()->saveRecord($record);

                // 9. Generate DRAFT_PREVIEW SalarySlip snapshot
                $this->createDraftSalarySlip($run, $record, $snapshot);

                $sumGross = $sumGross->add($breakdown['grossSalary']);
                $sumDeductions = $sumDeductions->add($breakdown['totalDeduction']);
                $sumTax = $sumTax->add($breakdown['totalTax']);
                $sumReimbursements = $sumReimbursements->add($breakdown['reimbursementAmount']);
                $sumNetPay = $sumNetPay->add($breakdown['netSalary']);
            }

            $run->setTotalEmployees($totalEligible);
            $run->setTotalGross($sumGross->toDatabaseString(4));
            $run->setTotalDeductions($sumDeductions->toDatabaseString(4));
            $run->setTotalTax($sumTax->toDatabaseString(4));
            $run->setTotalReimbursements($sumReimbursements->toDatabaseString(4));
            $run->setTotalNetPay($sumNetPay->toDatabaseString(4));
            $run->setExceptionCount($exceptionCount);
            $run->setStatus(PayrollRun::STATUS_CALCULATED);
            $this->getRunDao()->saveRun($run);

            $period->setStatus(PayrollPayPeriod::STATUS_IN_PROCESSING);
            $this->getPeriodDao()->savePayPeriod($period);

            $this->getConfigService()->recordAudit(
                'RUN_CALCULATED',
                'PayrollRun',
                $run->getId(),
                null,
                $actor,
                null,
                [
                    'totalEmployees' => $totalEligible,
                    'exceptionCount' => $exceptionCount,
                    'totalGross' => $run->getTotalGross(),
                    'totalNetPay' => $run->getTotalNetPay(),
                    'calculationVersion' => $run->getCalculationVersion(),
                ],
                $run
            );

            return $run;
        });
    }

    public function applyManualAdjustment(int $recordId, string $adjustmentAmountStr, string $reason, ?User $actor = null): PayrollRecord
    {
        $record = $this->getRunDao()->getRecordById($recordId);
        if ($record === null) {
            throw new PayrollException(sprintf('Payroll record #%d not found.', $recordId), PayrollException::CODE_NOT_FOUND, [], 404);
        }

        $run = $record->getPayrollRun();
        if (!in_array($run->getStatus(), [PayrollRun::STATUS_CALCULATED, PayrollRun::STATUS_REJECTED], true)) {
            throw new PayrollException(
                sprintf('Manual adjustments are not permitted when run status is "%s".', $run->getStatus()),
                PayrollException::CODE_IMMUTABLE_RECORD,
                ['runStatus' => $run->getStatus()],
                409
            );
        }

        $currency = $record->getCurrency()->getId();
        $adjustment = Money::of($adjustmentAmountStr, $currency)->roundHalfUp(2);
        $gross = Money::of($record->getGrossSalary(), $currency);
        $deductions = Money::of($record->getTotalDeduction(), $currency);
        $reimb = Money::of($record->getReimbursementAmount(), $currency);
        $newNet = $gross->sub($deductions)->add($reimb)->add($adjustment)->roundHalfUp(2);

        if ($newNet->isNegative()) {
            throw PayrollException::negativeNetPay($record->getEmployee()->getEmpNumber(), $newNet->toDatabaseString(2));
        }

        $before = [
            'adjustmentAmount' => $record->getAdjustmentAmount(),
            'netSalary' => $record->getNetSalary(),
        ];

        $em = Doctrine::getEntityManager();
        return $em->wrapInTransaction(function () use ($em, $record, $run, $adjustment, $newNet, $reason, $actor, $before): PayrollRecord {
            // Replace previous MANUAL_ADJUSTMENT item if any
            foreach ($record->getItems() as $item) {
                if ($item->getItemType() === PayrollItem::TYPE_ADJUSTMENT) {
                    $record->getItems()->removeElement($item);
                    $em->remove($item);
                }
            }

            if (!$adjustment->isZero()) {
                $adjItem = new PayrollItem();
                $adjItem->setItemType(PayrollItem::TYPE_ADJUSTMENT);
                $adjItem->setComponentCode('MANUAL_ADJ');
                $adjItem->setComponentName($adjustment->isPositive() ? 'Manual Addition / Arrears' : 'Manual Recovery / Deduction');
                $adjItem->setAmount($adjustment->toDatabaseString(2));
                $adjItem->setIsTaxable(false);
                $adjItem->setIsStatutory(false);
                $adjItem->setSourceModule('Payroll');
                $adjItem->setNotes(substr(trim($reason), 0, 250));
                $record->addItem($adjItem);
            }

            $record->setAdjustmentAmount($adjustment->toDatabaseString(2));
            $record->setNetSalary($newNet->toDatabaseString(2));
            $record->setIsManualOverride(true);
            $this->getRunDao()->saveRecord($record);

            // Refresh draft slip HTML
            $slip = $this->getRunDao()->getSalarySlipByRecordId($record->getId());
            if ($slip !== null && $record->getSnapshot() !== null) {
                $slip->setHtmlSnapshot(self::renderHtmlPayslip($record, $record->getSnapshot(), $slip->getSlipNumber()));
                $this->getRunDao()->saveSalarySlip($slip);
            }

            $this->recalculateRunTotals($run);

            $this->getConfigService()->recordAudit(
                'MANUAL_ADJUSTMENT_APPLIED',
                'PayrollRecord',
                $record->getId(),
                $record->getEmployee()->getEmpNumber(),
                $actor,
                $before,
                [
                    'adjustmentAmount' => $record->getAdjustmentAmount(),
                    'netSalary' => $record->getNetSalary(),
                    'reason' => trim($reason),
                ],
                $run
            );

            return $record;
        });
    }

    public function recalculateRunTotals(PayrollRun $run): void
    {
        $currency = $run->getPayPeriod()->getCurrency()->getId();
        $records = $this->getRunDao()->getRecordsByRunId($run->getId());

        $sumGross = Money::zero($currency);
        $sumDeductions = Money::zero($currency);
        $sumTax = Money::zero($currency);
        $sumReimbursements = Money::zero($currency);
        $sumNetPay = Money::zero($currency);

        foreach ($records as $r) {
            $sumGross = $sumGross->add(Money::of($r->getGrossSalary(), $currency));
            $sumDeductions = $sumDeductions->add(Money::of($r->getTotalDeduction(), $currency));
            $sumTax = $sumTax->add(Money::of($r->getTotalTax(), $currency));
            $sumReimbursements = $sumReimbursements->add(Money::of($r->getReimbursementAmount(), $currency));
            $sumNetPay = $sumNetPay->add(Money::of($r->getNetSalary(), $currency));
        }

        $run->setTotalEmployees(count($records));
        $run->setTotalGross($sumGross->toDatabaseString(4));
        $run->setTotalDeductions($sumDeductions->toDatabaseString(4));
        $run->setTotalTax($sumTax->toDatabaseString(4));
        $run->setTotalReimbursements($sumReimbursements->toDatabaseString(4));
        $run->setTotalNetPay($sumNetPay->toDatabaseString(4));
        $this->getRunDao()->saveRun($run);
    }

    /**
     * @param array<string,mixed> $breakdown
     * @param array<string,mixed> $leaveImpact
     */
    private function populateRecordItems(
        PayrollRecord $record,
        array $breakdown,
        PayrollEmployeeSnapshot $snapshot,
        array $leaveImpact,
        string $timeSourceUsed
    ): void {
        $lwpNote = (float)$leaveImpact['lwpDays'] > 0
            ? sprintf('Pro-rata after %.2f LWP days (Rs.%s)', $leaveImpact['lwpDays'], $breakdown['lwpDeduction']->toDatabaseString(2))
            : null;

        $addItem = function (
            string $type,
            string $code,
            string $name,
            Money $amt,
            bool $taxable,
            bool $statutory,
            string $source,
            ?string $notes = null
        ) use ($record): void {
            if ($amt->isZero()) {
                return;
            }
            $item = new PayrollItem();
            $item->setItemType($type);
            $item->setComponentCode($code);
            $item->setComponentName($name);
            $item->setAmount($amt->toDatabaseString(2));
            $item->setIsTaxable($taxable);
            $item->setIsStatutory($statutory);
            $item->setSourceModule($source);
            $item->setNotes($notes);
            $record->addItem($item);
        };

        $addItem(PayrollItem::TYPE_EARNING, 'BASIC', 'Basic Salary', $breakdown['basicSalary'], true, false, 'PIM', $lwpNote);
        $addItem(PayrollItem::TYPE_EARNING, 'HRA', 'House Rent Allowance (HRA)', $breakdown['hraAmount'], true, false, 'PIM');
        $addItem(PayrollItem::TYPE_EARNING, 'SPECIAL_ALLOWANCE', 'Special Allowance', $breakdown['specialAllowance'], true, false, 'PIM');
        $addItem(PayrollItem::TYPE_EARNING, 'OVERTIME', 'Overtime Pay', $breakdown['overtimeAmount'], true, false, $timeSourceUsed === 'ATTENDANCE_ONLY' ? 'Attendance' : 'Time');

        $addItem(PayrollItem::TYPE_REIMBURSEMENT, 'CLAIM_REIMBURSEMENT', 'Approved Expense Reimbursements', $breakdown['reimbursementAmount'], false, false, 'Claim', 'Non-taxable claim payout');

        $addItem(PayrollItem::TYPE_DEDUCTION, 'EPF_EE', 'Provident Fund (EPF Employee 12%)', $breakdown['epfEmployee'], false, true, 'Payroll');
        $addItem(PayrollItem::TYPE_DEDUCTION, 'ESIC_EE', 'ESIC (Employee 0.75%)', $breakdown['esicEmployee'], false, true, 'Payroll');
        $addItem(PayrollItem::TYPE_DEDUCTION, 'PT', sprintf('Professional Tax (%s)', $snapshot->getPtStateCode()), $breakdown['professionalTax'], false, true, 'Payroll');

        $addItem(PayrollItem::TYPE_TAX, 'INCOME_TAX_TDS', sprintf('Income Tax TDS (%s)', $breakdown['taxRegime']), $breakdown['incomeTaxTds'], false, true, 'Payroll');
        $addItem(PayrollItem::TYPE_TAX, 'HEALTH_ED_CESS', 'Health & Education Cess (4%)', $breakdown['healthEducationCess'], false, true, 'Payroll');

        $epfNote = sprintf(
            'EPS 8.33%%: %s | EPF Diff 3.67%%: %s',
            $breakdown['epfEmployerEps']->toDatabaseString(2),
            $breakdown['epfEmployerDiff']->toDatabaseString(2)
        );
        $addItem(PayrollItem::TYPE_STATUTORY_EMPLOYER, 'EPF_ER', 'Employer EPF Contribution (12%)', $breakdown['epfEmployer'], false, true, 'Payroll', $epfNote);
        $addItem(PayrollItem::TYPE_STATUTORY_EMPLOYER, 'ESIC_ER', 'Employer ESIC Contribution (3.25%)', $breakdown['esicEmployer'], false, true, 'Payroll');
    }

    private function createDraftSalarySlip(PayrollRun $run, PayrollRecord $record, PayrollEmployeeSnapshot $snapshot): SalarySlip
    {
        $period = $run->getPayPeriod();
        $slipNumber = sprintf(
            'SLP-%s-R%d-E%04d',
            $period->getStartDate()->format('Ym'),
            $run->getId(),
            $record->getEmployee()->getEmpNumber()
        );

        $slip = new SalarySlip();
        $slip->setPayrollRecord($record);
        $slip->setPayrollRun($run);
        $slip->setEmpNumber($record->getEmployee()->getEmpNumber());
        $slip->setSlipNumber($slipNumber);
        $slip->setSlipStatus(SalarySlip::STATUS_DRAFT_PREVIEW);
        $slip->setFilePath('/payroll/slips/' . $slipNumber);
        $slip->setGeneratedAt(new DateTime());
        $slip->setHtmlSnapshot(self::renderHtmlPayslip($record, $snapshot, $slipNumber));
        return $this->getRunDao()->saveSalarySlip($slip);
    }

    public static function renderHtmlPayslip(PayrollRecord $record, PayrollEmployeeSnapshot $snapshot, string $slipNumber): string
    {
        $period = $record->getPayPeriod();
        $payload = json_decode($snapshot->getSnapshotPayloadJson(), true) ?: [];
        $maskedAcct = htmlspecialchars((string)($payload['profile']['maskedBankAccount'] ?? 'On File'), ENT_QUOTES, 'UTF-8');
        $empName = htmlspecialchars($snapshot->getFullName(), ENT_QUOTES, 'UTF-8');
        $empCode = htmlspecialchars((string)($snapshot->getEmployeeCode() ?? ''), ENT_QUOTES, 'UTF-8');
        $dept = htmlspecialchars((string)($snapshot->getDepartmentName() ?? '-'), ENT_QUOTES, 'UTF-8');
        $title = htmlspecialchars((string)($snapshot->getJobTitleName() ?? '-'), ENT_QUOTES, 'UTF-8');
        $periodName = htmlspecialchars($period->getName(), ENT_QUOTES, 'UTF-8');
        $calcVersion = htmlspecialchars((string)($record->getPayrollRun() ? $record->getPayrollRun()->getCalculationVersion() : 'v2.2-IN-FY26'), ENT_QUOTES, 'UTF-8');
        $statusLabel = $record->getStatus() === PayrollRecord::STATUS_LOCKED ? 'PUBLISHED / FINAL' : htmlspecialchars($record->getStatus(), ENT_QUOTES, 'UTF-8');

        $fmt = static fn (string $v): string => '&#8377;' . number_format((float)$v, 2);

        $earningsRows = '';
        $deductionRows = '';
        $reimbRows = '';
        foreach ($record->getItems() as $item) {
            $name = htmlspecialchars($item->getComponentName(), ENT_QUOTES, 'UTF-8');
            $amt = $fmt($item->getAmount());
            if ($item->getItemType() === PayrollItem::TYPE_EARNING) {
                $earningsRows .= "<tr><td>{$name}</td><td style='text-align:right'>{$amt}</td></tr>";
            } elseif (in_array($item->getItemType(), [PayrollItem::TYPE_DEDUCTION, PayrollItem::TYPE_TAX], true)) {
                $deductionRows .= "<tr><td>{$name}</td><td style='text-align:right'>{$amt}</td></tr>";
            } elseif ($item->getItemType() === PayrollItem::TYPE_REIMBURSEMENT) {
                $reimbRows .= "<tr><td>{$name}</td><td style='text-align:right'>{$amt}</td></tr>";
            } elseif ($item->getItemType() === PayrollItem::TYPE_ADJUSTMENT) {
                if ((float)$item->getAmount() >= 0) {
                    $earningsRows .= "<tr><td>{$name}</td><td style='text-align:right'>{$amt}</td></tr>";
                } else {
                    $deductionRows .= "<tr><td>{$name}</td><td style='text-align:right'>{$amt}</td></tr>";
                }
            }
        }

        $gross = $fmt($record->getGrossSalary());
        $ded = $fmt($record->getTotalDeduction());
        $reimb = $fmt($record->getReimbursementAmount());
        $net = $fmt($record->getNetSalary());
        $lwpInfo = ((float)$record->getLwpDays() > 0)
            ? " | LWP Days: {$record->getLwpDays()} (-{$fmt($record->getLwpDeduction())})"
            : '';

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Payslip {$slipNumber}</title>
<style>
  body { font-family: 'Nunito Sans', Arial, sans-serif; color: #38455d; margin: 24px; background: #fff; }
  .sheet { max-width: 820px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; padding: 24px; }
  .hdr { display: flex; justify-content: space-between; border-bottom: 2px solid #ff7b1d; padding-bottom: 12px; margin-bottom: 16px; }
  .brand { font-size: 20px; font-weight: 700; color: #ff7b1d; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; font-size: 13px; margin-bottom: 18px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { padding: 8px 10px; border-bottom: 1px solid #edf2f7; text-align: left; }
  th { background: #f6f5fb; font-weight: 700; }
  .tot { background: #f8fafc; font-weight: 700; }
  .netbox { margin-top: 18px; padding: 14px 18px; background: #fff7f1; border: 1px solid #ffd5b8; border-radius: 8px; display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; }
  .ft { margin-top: 14px; font-size: 11px; color: #64728c; text-align: center; }
</style></head>
<body>
<div class="sheet">
  <div class="hdr">
    <div><div class="brand">OrangeHRM India Payroll</div><div>Payslip &mdash; {$periodName}</div></div>
    <div style="text-align:right;font-size:12px;"><div><b>Slip No:</b> {$slipNumber}</div><div><b>Status:</b> {$statusLabel}</div></div>
  </div>
  <div class="meta">
    <div><b>Employee:</b> {$empName} ({$empCode})</div><div><b>Department:</b> {$dept}</div>
    <div><b>Designation:</b> {$title}</div><div><b>Tax Regime / PT State:</b> {$record->getTaxRegime()} / {$snapshot->getPtStateCode()}</div>
    <div><b>Working / Payable Days:</b> {$record->getWorkingDays()} / {$record->getPayableDays()}{$lwpInfo}</div><div><b>Bank Account:</b> {$maskedAcct}</div>
  </div>
  <div class="grid">
    <table><thead><tr><th>Earnings</th><th style="text-align:right">Amount (INR)</th></tr></thead>
      <tbody>{$earningsRows}{$reimbRows}<tr class="tot"><td>Total Gross + Reimbursements</td><td style="text-align:right">{$gross} + {$reimb}</td></tr></tbody>
    </table>
    <table><thead><tr><th>Statutory Deductions &amp; Taxes</th><th style="text-align:right">Amount (INR)</th></tr></thead>
      <tbody>{$deductionRows}<tr class="tot"><td>Total Deductions</td><td style="text-align:right">{$ded}</td></tr></tbody>
    </table>
  </div>
  <div class="netbox"><span>Net Payable Salary</span><span>{$net}</span></div>
  <div class="ft">System-generated payslip from OrangeHRM 5.8 India Payroll Extension v2.2. Calculation Ref: {$calcVersion}</div>
</div>
</body></html>
HTML;
    }
}
