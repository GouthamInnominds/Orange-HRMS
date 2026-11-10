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

namespace OrangeHRM\Entity;

use DateTime;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="ohrm_salary_slip")
 * @ORM\Entity
 */
class SalarySlip
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private int $id;

    /**
     * @var PayrollRecord
     *
     * @ORM\OneToOne(targetEntity="OrangeHRM\Entity\PayrollRecord")
     * @ORM\JoinColumn(name="payroll_record_id", referencedColumnName="id", nullable=false)
     */
    private PayrollRecord $payrollRecord;

    /**
     * @var string
     *
     * @ORM\Column(name="slip_number", type="string", length=50, unique=true)
     */
    private string $slipNumber;

    /**
     * @var string
     *
     * @ORM\Column(name="file_path", type="string", length=255)
     */
    private string $filePath;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="generated_at", type="datetime")
     */
    private DateTime $generatedAt;

    /**
     * @var DateTime|null
     *
     * @ORM\Column(name="downloaded_at", type="datetime", nullable=true)
     */
    private ?DateTime $downloadedAt = null;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getPayrollRecord(): PayrollRecord
    {
        return $this->payrollRecord;
    }

    public function setPayrollRecord(PayrollRecord $payrollRecord): void
    {
        $this->payrollRecord = $payrollRecord;
    }

    public function getSlipNumber(): string
    {
        return $this->slipNumber;
    }

    public function setSlipNumber(string $slipNumber): void
    {
        $this->slipNumber = $slipNumber;
    }

    public function getFilePath(): string
    {
        return $this->filePath;
    }

    public function setFilePath(string $filePath): void
    {
        $this->filePath = $filePath;
    }

    public function getGeneratedAt(): DateTime
    {
        return $this->generatedAt;
    }

    public function setGeneratedAt(DateTime $generatedAt): void
    {
        $this->generatedAt = $generatedAt;
    }

    public function getDownloadedAt(): ?DateTime
    {
        return $this->downloadedAt;
    }

    public function setDownloadedAt(?DateTime $downloadedAt): void
    {
        $this->downloadedAt = $downloadedAt;
    }
}
