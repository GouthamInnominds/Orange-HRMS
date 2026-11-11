<?php

declare(strict_types=1);

/**
 * Environment-Guarded Demo Seed Script for India-Standard Payroll Extension v2.2
 *
 * Refuses to execute unless:
 *   APP_ENV=development ALLOW_DEMO_SEED=true
 *
 * Usage (WSL):
 *   APP_ENV=development ALLOW_DEMO_SEED=true wsl -e php tools/qkg_engine/seed_payroll_demo_data.php
 */

if (getenv('APP_ENV') !== 'development' || getenv('ALLOW_DEMO_SEED') !== 'true') {
    fwrite(STDERR, "BLOCKED: Demo seeding requires APP_ENV=development and ALLOW_DEMO_SEED=true.\n");
    exit(1);
}

$host = getenv('OHRM_DB_HOST') ?: '127.0.0.1';
$port = getenv('OHRM_DB_PORT') ?: '3306';
$db   = getenv('OHRM_DB_NAME') ?: 'orangehrm_mysql';
$user = getenv('OHRM_DB_USER') ?: 'root';
$pass = getenv('OHRM_DB_PASS') ?: 'root';

$pdo = new PDO(
    "mysql:host={$host};port={$port};dbname={$db};charset=utf8mb4",
    $user,
    $pass,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$pdo->beginTransaction();

try {
    // 1. Ensure Clean Employment Status 'Full-Time Permanent'
    $empStatusId = $pdo->query("SELECT id FROM ohrm_employment_status WHERE name = 'Full-Time Permanent'")->fetchColumn();
    if (!$empStatusId) {
        $pdo->exec("INSERT INTO ohrm_employment_status (name) VALUES ('Full-Time Permanent')");
        $empStatusId = (int)$pdo->lastInsertId();
    } else {
        $empStatusId = (int)$empStatusId;
    }

    // 2. Ensure Organization Subunits (Engineering, Finance & Payroll, Operations) under Root (id=1)
    $ensureSubunit = static function (PDO $pdo, string $name, string $unitId): int {
        $stmt = $pdo->prepare("SELECT id FROM ohrm_subunit WHERE name = ?");
        $stmt->execute([$name]);
        $existing = $stmt->fetchColumn();
        if ($existing) {
            return (int)$existing;
        }
        $rootRgt = (int)($pdo->query("SELECT rgt FROM ohrm_subunit WHERE id = 1")->fetchColumn() ?: 2);
        $pdo->prepare("UPDATE ohrm_subunit SET rgt = rgt + 2 WHERE rgt >= ?")->execute([$rootRgt]);
        $pdo->prepare("INSERT INTO ohrm_subunit (name, unit_id, description, lft, rgt, level) VALUES (?, ?, ?, ?, ?, 1)")
            ->execute([$name, $unitId, "$name Department", $rootRgt, $rootRgt + 1]);
        return (int)$pdo->lastInsertId();
    };
    $engUnitId = $ensureSubunit($pdo, 'Engineering', 'ENG');
    $finUnitId = $ensureSubunit($pdo, 'Finance & Payroll', 'FIN');
    $opsUnitId = $ensureSubunit($pdo, 'Operations', 'OPS');

    // 3. Job Titles & Pay Grades
    $ensureJobTitle = static function (PDO $pdo, string $title): int {
        $stmt = $pdo->prepare("SELECT id FROM ohrm_job_title WHERE job_title = ? AND is_deleted = 0");
        $stmt->execute([$title]);
        $id = $stmt->fetchColumn();
        if ($id) {
            return (int)$id;
        }
        $pdo->prepare("INSERT INTO ohrm_job_title (job_title, job_description, note, is_deleted) VALUES (?, ?, '', 0)")
            ->execute([$title, $title]);
        return (int)$pdo->lastInsertId();
    };
    $jtEng = $ensureJobTitle($pdo, 'Senior Software Engineer');
    $jtFin = $ensureJobTitle($pdo, 'Finance Director');
    $jtOps = $ensureJobTitle($pdo, 'Operations Associate');
    $jtSys = $ensureJobTitle($pdo, 'Systems Analyst');

    $ensurePayGrade = static function (PDO $pdo, string $name, string $minSal, string $maxSal): int {
        $stmt = $pdo->prepare("SELECT id FROM ohrm_pay_grade WHERE name = ?");
        $stmt->execute([$name]);
        $id = $stmt->fetchColumn();
        if (!$id) {
            $pdo->prepare("INSERT INTO ohrm_pay_grade (name) VALUES (?)")->execute([$name]);
            $id = (int)$pdo->lastInsertId();
        } else {
            $id = (int)$id;
        }
        $pdo->prepare(
            "INSERT INTO ohrm_pay_grade_currency (pay_grade_id, currency_id, min_salary, max_salary)
             VALUES (?, 'INR', ?, ?)
             ON DUPLICATE KEY UPDATE min_salary = VALUES(min_salary), max_salary = VALUES(max_salary)"
        )->execute([$id, $minSal, $maxSal]);
        return $id;
    };
    $pgL4 = $ensurePayGrade($pdo, 'IN-L4 Operations', '15000', '60000');
    $pgL6 = $ensurePayGrade($pdo, 'IN-L6 Engineering', '50000', '160000');
    $pgM1 = $ensurePayGrade($pdo, 'IN-M1 Executive', '100000', '300000');

    // 4. Leave Types & Explicit Payroll Leave Policy Mapping
    $ensureLeaveType = static function (PDO $pdo, string $name, string $treatment, string $multiplier, string $notes): int {
        $stmt = $pdo->prepare("SELECT id FROM ohrm_leave_type WHERE name = ? AND deleted = 0");
        $stmt->execute([$name]);
        $id = $stmt->fetchColumn();
        if (!$id) {
            $pdo->prepare("INSERT INTO ohrm_leave_type (name, deleted, exclude_in_reports_if_no_entitlement) VALUES (?, 0, 0)")
                ->execute([$name]);
            $id = (int)$pdo->lastInsertId();
        } else {
            $id = (int)$id;
        }
        $pdo->prepare(
            "INSERT INTO ohrm_payroll_leave_policy (leave_type_id, payroll_pay_treatment, deduction_multiplier, effective_from, notes)
             VALUES (?, ?, ?, '2026-04-01', ?)
             ON DUPLICATE KEY UPDATE payroll_pay_treatment = VALUES(payroll_pay_treatment), deduction_multiplier = VALUES(deduction_multiplier), notes = VALUES(notes)"
        )->execute([$id, $treatment, $multiplier, $notes]);
        return $id;
    };
    $ltPaid = $ensureLeaveType($pdo, 'Earned Leave (Paid)', 'PAID', '0.00', 'Zero LWP salary deduction');
    $ltLwp  = $ensureLeaveType($pdo, 'Loss of Pay (LWP)', 'UNPAID', '1.00', 'Full daily LWP salary deduction');
    $ltHalf = $ensureLeaveType($pdo, 'Medical Leave (Half Pay)', 'HALF_PAID', '0.50', '50% daily LWP salary deduction');

    // 5. Claim Event & Expense Type
    $eventId = $pdo->query("SELECT id FROM ohrm_claim_event WHERE name = 'India Domestic Travel & Client Reimbursement' AND is_deleted = 0")->fetchColumn();
    if (!$eventId) {
        $pdo->exec("INSERT INTO ohrm_claim_event (name, description, added_by, status, is_deleted) VALUES ('India Domestic Travel & Client Reimbursement', 'Travel & client onsite expense reimbursements settled in monthly INR payroll', 1, 1, 0)");
        $eventId = (int)$pdo->lastInsertId();
    } else {
        $eventId = (int)$eventId;
    }

    $expTypeId = $pdo->query("SELECT id FROM ohrm_expense_type WHERE name = 'Travel & Lodging' AND is_deleted = 0")->fetchColumn();
    if (!$expTypeId) {
        $pdo->exec("INSERT INTO ohrm_expense_type (name, description, added_by, status, is_deleted) VALUES ('Travel & Lodging', 'Domestic flight, train, hotel, and cab bills', 1, 1, 0)");
        $expTypeId = (int)$pdo->lastInsertId();
    } else {
        $expTypeId = (int)$expTypeId;
    }

    // Helper: Ensure Employee, Basic Salary, Statutory Profile, and Optional User Login
    $ensureEmployee = static function (PDO $pdo, array $cfg) use ($empStatusId): int {
        $stmt = $pdo->prepare("SELECT emp_number FROM hs_hr_employee WHERE employee_id = ?");
        $stmt->execute([$cfg['employeeId']]);
        $empNumber = $stmt->fetchColumn();
        if (!$empNumber) {
            $pdo->prepare(
                "INSERT INTO hs_hr_employee
                 (employee_id, emp_firstname, emp_lastname, emp_status, job_title_code, work_station, emp_work_email, joined_date)
                 VALUES (?, ?, ?, ?, ?, ?, ?, '2025-04-01')"
            )->execute([
                $cfg['employeeId'],
                $cfg['firstName'],
                $cfg['lastName'],
                $empStatusId,
                $cfg['jobTitleId'],
                $cfg['subunitId'],
                $cfg['email'],
            ]);
            $empNumber = (int)$pdo->lastInsertId();
        } else {
            $empNumber = (int)$empNumber;
            $pdo->prepare(
                "UPDATE hs_hr_employee SET emp_status = ?, job_title_code = ?, work_station = ?, emp_work_email = ? WHERE emp_number = ?"
            )->execute([$empStatusId, $cfg['jobTitleId'], $cfg['subunitId'], $cfg['email'], $empNumber]);
        }

        // Replace basic salary cleanly for deterministic payroll demo
        $pdo->prepare("DELETE FROM hs_hr_emp_basicsalary WHERE emp_number = ?")->execute([$empNumber]);
        if ($cfg['salary'] !== null) {
            $pdo->prepare(
                "INSERT INTO hs_hr_emp_basicsalary
                 (emp_number, sal_grd_code, currency_id, ebsal_basic_salary, payperiod_code, salary_component, comments)
                 VALUES (?, ?, ?, ?, '4', ?, 'Demo INR Monthly CTC')"
            )->execute([
                $empNumber,
                $cfg['payGradeId'],
                $cfg['currency'],
                $cfg['salary'],
                $cfg['componentName'],
            ]);
        }

        // Upsert Employee Statutory Profile
        $p = $cfg['profile'];
        $pdo->prepare(
            "INSERT INTO ohrm_payroll_emp_profile
             (emp_number, pan_number, uan_number, esic_ip_number, pt_state_code, tax_regime, epf_opted_in, epf_restrict_to_ceiling, esic_applicable, pt_applicable, basic_percent_of_ctc, hra_percent_of_basic, declared_80c, declared_80d, declared_hra_annual, other_exemptions, bank_account_holder, bank_account_number, bank_ifsc_code, bank_name, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE
               pan_number = VALUES(pan_number),
               uan_number = VALUES(uan_number),
               esic_ip_number = VALUES(esic_ip_number),
               pt_state_code = VALUES(pt_state_code),
               tax_regime = VALUES(tax_regime),
               epf_opted_in = VALUES(epf_opted_in),
               epf_restrict_to_ceiling = VALUES(epf_restrict_to_ceiling),
               esic_applicable = VALUES(esic_applicable),
               pt_applicable = VALUES(pt_applicable),
               basic_percent_of_ctc = VALUES(basic_percent_of_ctc),
               hra_percent_of_basic = VALUES(hra_percent_of_basic),
               declared_80c = VALUES(declared_80c),
               declared_80d = VALUES(declared_80d),
               declared_hra_annual = VALUES(declared_hra_annual),
               other_exemptions = VALUES(other_exemptions),
               bank_account_holder = VALUES(bank_account_holder),
               bank_account_number = VALUES(bank_account_number),
               bank_ifsc_code = VALUES(bank_ifsc_code),
               bank_name = VALUES(bank_name),
               updated_at = NOW()"
        )->execute([
            $empNumber,
            $p['pan'],
            $p['uan'],
            $p['esic'],
            $p['ptState'],
            $p['taxRegime'],
            $p['epfOpted'],
            $p['epfCap'],
            $p['esicApp'],
            $p['ptApp'],
            $p['basicPct'],
            $p['hraPct'],
            $p['d80c'],
            $p['d80d'],
            $p['dHra'],
            $p['dOther'],
            $p['holder'],
            $p['acct'],
            $p['ifsc'],
            $p['bank'],
        ]);

        // Ensure User login if specified
        if (!empty($cfg['username'])) {
            $hash = password_hash($cfg['password'], PASSWORD_BCRYPT);
            $uStmt = $pdo->prepare("SELECT id FROM ohrm_user WHERE user_name = ?");
            $uStmt->execute([$cfg['username']]);
            $uId = $uStmt->fetchColumn();
            if (!$uId) {
                $pdo->prepare(
                    "INSERT INTO ohrm_user (user_role_id, emp_number, user_name, user_password, deleted, status, date_entered, created_by)
                     VALUES (?, ?, ?, ?, 0, 1, NOW(), 1)"
                )->execute([$cfg['roleId'], $empNumber, $cfg['username'], $hash]);
            } else {
                $pdo->prepare(
                    "UPDATE ohrm_user SET user_role_id = ?, emp_number = ?, user_password = ?, deleted = 0, status = 1 WHERE id = ?"
                )->execute([$cfg['roleId'], $empNumber, $hash, $uId]);
            }
        }

        // Termination handling
        if (!empty($cfg['terminatedDate'])) {
            $tStmt = $pdo->prepare("SELECT id FROM ohrm_emp_termination WHERE emp_number = ?");
            $tStmt->execute([$empNumber]);
            $tId = $tStmt->fetchColumn();
            if (!$tId) {
                $pdo->prepare("INSERT INTO ohrm_emp_termination (emp_number, reason_id, termination_date, note) VALUES (?, 6, ?, 'Resigned prior to November 2026 payroll period')")
                    ->execute([$empNumber, $cfg['terminatedDate']]);
                $tId = (int)$pdo->lastInsertId();
            }
            $pdo->prepare("UPDATE hs_hr_employee SET termination_id = ? WHERE emp_number = ?")->execute([$tId, $empNumber]);
        } else {
            $pdo->prepare("UPDATE hs_hr_employee SET termination_id = NULL WHERE emp_number = ?")->execute([$empNumber]);
        }

        return $empNumber;
    };

    // 6. Create 6 Showcase Employees covering every Indian scenario & edge case
    $empAarav = $ensureEmployee($pdo, [
        'employeeId' => 'EMP-IN-001',
        'firstName' => 'Aarav',
        'lastName' => 'Sharma',
        'jobTitleId' => $jtEng,
        'subunitId' => $engUnitId,
        'email' => 'aarav.sharma@orangehrm.in',
        'payGradeId' => $pgL6,
        'currency' => 'INR',
        'salary' => '106250.00',
        'componentName' => 'Monthly Gross CTC',
        'username' => 'aarav.ess',
        'password' => 'EmpInd@2026!',
        'roleId' => 2, // ESS
        'profile' => [
            'pan' => 'ABCPA1234K', 'uan' => '100987654321', 'esic' => null,
            'ptState' => 'KA', 'taxRegime' => 'NEW_115BAC',
            'epfOpted' => 1, 'epfCap' => 1, 'esicApp' => 0, 'ptApp' => 1,
            'basicPct' => '50.00', 'hraPct' => '40.00',
            'd80c' => '0.00', 'd80d' => '0.00', 'dHra' => '0.00', 'dOther' => '0.00',
            'holder' => 'Aarav Sharma', 'acct' => '50100987654321', 'ifsc' => 'HDFC0001234', 'bank' => 'HDFC Bank',
        ],
    ]);

    $empMeera = $ensureEmployee($pdo, [
        'employeeId' => 'EMP-IN-002',
        'firstName' => 'Meera',
        'lastName' => 'Nair',
        'jobTitleId' => $jtFin,
        'subunitId' => $finUnitId,
        'email' => 'meera.nair@orangehrm.in',
        'payGradeId' => $pgM1,
        'currency' => 'INR',
        'salary' => '150000.00',
        'componentName' => 'Monthly Executive CTC',
        'username' => 'fin.approver',
        'password' => 'Approver@123',
        'roleId' => 8, // PayrollApprover (Separation of Duties)
        'profile' => [
            'pan' => 'ABCPM5678L', 'uan' => '100456789012', 'esic' => null,
            'ptState' => 'KA', 'taxRegime' => 'OLD',
            'epfOpted' => 1, 'epfCap' => 1, 'esicApp' => 0, 'ptApp' => 1,
            'basicPct' => '50.00', 'hraPct' => '40.00',
            'd80c' => '150000.00', 'd80d' => '25000.00', 'dHra' => '180000.00', 'dOther' => '0.00',
            'holder' => 'Meera Nair', 'acct' => '00450199887766', 'ifsc' => 'ICIC0000456', 'bank' => 'ICICI Bank',
        ],
    ]);

    $empRajesh = $ensureEmployee($pdo, [
        'employeeId' => 'EMP-IN-003',
        'firstName' => 'Rajesh',
        'lastName' => 'Kumar',
        'jobTitleId' => $jtOps,
        'subunitId' => $opsUnitId,
        'email' => 'rajesh.kumar@orangehrm.in',
        'payGradeId' => $pgL4,
        'currency' => 'INR',
        'salary' => '18000.00',
        'componentName' => 'Monthly Gross Wages',
        'username' => 'rajesh.ess',
        'password' => 'EmpInd@2026!',
        'roleId' => 2, // ESS
        'profile' => [
            'pan' => 'ABCPR4321M', 'uan' => '100334455667', 'esic' => '3100123456',
            'ptState' => 'MH', 'taxRegime' => 'NEW_115BAC',
            'epfOpted' => 1, 'epfCap' => 1, 'esicApp' => 1, 'ptApp' => 1,
            'basicPct' => '50.00', 'hraPct' => '40.00',
            'd80c' => '0.00', 'd80d' => '0.00', 'dHra' => '0.00', 'dOther' => '0.00',
            'holder' => 'Rajesh Kumar', 'acct' => '301122334455', 'ifsc' => 'SBIN0000300', 'bank' => 'State Bank of India',
        ],
    ]);

    $empAnanya = $ensureEmployee($pdo, [
        'employeeId' => 'EMP-IN-004',
        'firstName' => 'Ananya',
        'lastName' => 'Das',
        'jobTitleId' => $jtSys,
        'subunitId' => $engUnitId,
        'email' => 'ananya.das@orangehrm.in',
        'payGradeId' => $pgL4,
        'currency' => 'INR',
        'salary' => '42000.00',
        'componentName' => 'Monthly Gross CTC',
        'username' => 'ananya.ess',
        'password' => 'EmpInd@2026!',
        'roleId' => 2,
        'profile' => [
            'pan' => 'ABCPD9988N', 'uan' => '100889900112', 'esic' => null,
            'ptState' => 'WB', 'taxRegime' => 'NEW_115BAC',
            'epfOpted' => 1, 'epfCap' => 1, 'esicApp' => 0, 'ptApp' => 1,
            'basicPct' => '50.00', 'hraPct' => '40.00',
            'd80c' => '0.00', 'd80d' => '0.00', 'dHra' => '0.00', 'dOther' => '0.00',
            'holder' => null, 'acct' => null, 'ifsc' => null, 'bank' => null, // Missing bank triggers warning
        ],
    ]);

    // Terminated employee (edge case -> skipped in November 2026)
    $ensureEmployee($pdo, [
        'employeeId' => 'EMP-IN-005',
        'firstName' => 'Vikram',
        'lastName' => 'Patel',
        'jobTitleId' => $jtEng,
        'subunitId' => $engUnitId,
        'email' => 'vikram.patel@orangehrm.in',
        'payGradeId' => $pgL6,
        'currency' => 'INR',
        'salary' => '60000.00',
        'componentName' => 'Monthly Gross CTC',
        'terminatedDate' => '2026-10-15',
        'profile' => [
            'pan' => 'ABCPP7766T', 'uan' => '100555666777', 'esic' => null,
            'ptState' => 'KA', 'taxRegime' => 'NEW_115BAC',
            'epfOpted' => 1, 'epfCap' => 1, 'esicApp' => 0, 'ptApp' => 1,
            'basicPct' => '50.00', 'hraPct' => '40.00',
            'd80c' => '0.00', 'd80d' => '0.00', 'dHra' => '0.00', 'dOther' => '0.00',
            'holder' => 'Vikram Patel', 'acct' => '998877665544', 'ifsc' => 'HDFC0001234', 'bank' => 'HDFC Bank',
        ],
    ]);

    // USD salary employee (edge case -> skipped due to currency mismatch with INR period)
    $ensureEmployee($pdo, [
        'employeeId' => 'EMP-IN-006',
        'firstName' => 'Sneha',
        'lastName' => 'Iyer',
        'jobTitleId' => $jtOps,
        'subunitId' => $opsUnitId,
        'email' => 'sneha.iyer@orangehrm.in',
        'payGradeId' => $pgL4,
        'currency' => 'USD',
        'salary' => '4500.00',
        'componentName' => 'US Expat Stipend',
        'profile' => [
            'pan' => null, 'uan' => null, 'esic' => null,
            'ptState' => 'KA', 'taxRegime' => 'NEW_115BAC',
            'epfOpted' => 0, 'epfCap' => 1, 'esicApp' => 0, 'ptApp' => 0,
            'basicPct' => '50.00', 'hraPct' => '40.00',
            'd80c' => '0.00', 'd80d' => '0.00', 'dHra' => '0.00', 'dOther' => '0.00',
            'holder' => null, 'acct' => null, 'ifsc' => null, 'bank' => null,
        ],
    ]);

    // 7. Seed Cross-Module Leave Records in November 2026
    // Clean only November 2026 demo leaves for seeded employees first
    $seedEmps = [$empAarav, $empAnanya];
    foreach ($seedEmps as $se) {
        $pdo->prepare("DELETE FROM ohrm_leave WHERE emp_number = ? AND date BETWEEN '2026-11-01' AND '2026-11-30'")->execute([$se]);
        $pdo->prepare("DELETE FROM ohrm_leave_request WHERE emp_number = ? AND date_applied BETWEEN '2026-10-25' AND '2026-11-30'")->execute([$se]);
    }
    // Aarav: 1 day APPROVED Unpaid LWP (2026-11-10)
    $pdo->prepare("INSERT INTO ohrm_leave_request (leave_type_id, date_applied, emp_number) VALUES (?, '2026-11-01', ?)")
        ->execute([$ltLwp, $empAarav]);
    $lrAarav = (int)$pdo->lastInsertId();
    $pdo->prepare("INSERT INTO ohrm_leave (date, length_hours, length_days, status, leave_request_id, leave_type_id, emp_number, duration_type) VALUES ('2026-11-10', 8.00, 1.0000, 2, ?, ?, ?, 0)")
        ->execute([$lrAarav, $ltLwp, $empAarav]);

    // Ananya: 2 days Paid Earned Leave (zero deduction) + 1 day Half-Paid Medical (0.5x deduction)
    $pdo->prepare("INSERT INTO ohrm_leave_request (leave_type_id, date_applied, emp_number) VALUES (?, '2026-11-02', ?)")
        ->execute([$ltPaid, $empAnanya]);
    $lrAnanyaPaid = (int)$pdo->lastInsertId();
    $pdo->prepare("INSERT INTO ohrm_leave (date, length_hours, length_days, status, leave_request_id, leave_type_id, emp_number, duration_type) VALUES ('2026-11-04', 8.00, 1.0000, 3, ?, ?, ?, 0), ('2026-11-05', 8.00, 1.0000, 3, ?, ?, ?, 0)")
        ->execute([$lrAnanyaPaid, $ltPaid, $empAnanya, $lrAnanyaPaid, $ltPaid, $empAnanya]);

    $pdo->prepare("INSERT INTO ohrm_leave_request (leave_type_id, date_applied, emp_number) VALUES (?, '2026-11-11', ?)")
        ->execute([$ltHalf, $empAnanya]);
    $lrAnanyaHalf = (int)$pdo->lastInsertId();
    $pdo->prepare("INSERT INTO ohrm_leave (date, length_hours, length_days, status, leave_request_id, leave_type_id, emp_number, duration_type) VALUES ('2026-11-12', 8.00, 1.0000, 2, ?, ?, ?, 0)")
        ->execute([$lrAnanyaHalf, $ltHalf, $empAnanya]);

    // 8. Seed Attendance Overtime for Rajesh Kumar in November 2026 (21 weekdays @ 8h = 168h + 1 Saturday shift @ 8h = 176h -> 8h OT)
    $pdo->prepare("DELETE FROM ohrm_attendance_record WHERE employee_id = ? AND punch_in_user_time BETWEEN '2026-11-01 00:00:00' AND '2026-11-30 23:59:59'")
        ->execute([$empRajesh]);
    $shiftDates = [
        '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06',
        '2026-11-09', '2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13',
        '2026-11-14', // Extra Saturday 8h overtime shift!
        '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20',
        '2026-11-23', '2026-11-24', '2026-11-25', '2026-11-26', '2026-11-27',
        '2026-11-30',
    ];
    $attStmt = $pdo->prepare(
        "INSERT INTO ohrm_attendance_record
         (employee_id, punch_in_utc_time, punch_in_time_offset, punch_in_user_time, punch_out_utc_time, punch_out_time_offset, punch_out_user_time, state, punch_in_timezone_name, punch_out_timezone_name)
         VALUES (?, ?, '5.5', ?, ?, '5.5', ?, 'PUNCHED OUT', 'Asia/Kolkata', 'Asia/Kolkata')"
    );
    foreach ($shiftDates as $d) {
        $attStmt->execute([
            $empRajesh,
            "$d 03:30:00",
            "$d 09:00:00",
            "$d 11:30:00",
            "$d 17:00:00",
        ]);
    }

    // 9. Seed APPROVED Claim Request (INR 3,450) for Aarav Sharma (only if REF-CLM-IN-001 doesn't exist)
    $existingClaim = $pdo->query("SELECT id, status FROM ohrm_claim_request WHERE reference_id = 'REF-CLM-IN-001'")->fetch(PDO::FETCH_ASSOC);
    if (!$existingClaim) {
        $pdo->prepare(
            "INSERT INTO ohrm_claim_request
             (emp_number, added_by, reference_id, event_type_id, description, currency_id, is_deleted, status, created_date, submitted_date)
             VALUES (?, 1, 'REF-CLM-IN-001', ?, 'Bengaluru to Chennai client workshop travel', 'INR', 0, 'APPROVED', '2026-11-08 10:00:00', '2026-11-08 10:15:00')"
        )->execute([$empAarav, $eventId]);
        $claimId = (int)$pdo->lastInsertId();
        $pdo->prepare(
            "INSERT INTO ohrm_expense (expense_type_id, date, amount, note, request_id, is_deleted)
             VALUES (?, '2026-11-07 09:00:00', 2250.00, 'Shatabdi Express & local cab', ?, 0),
                    (?, '2026-11-07 20:00:00', 1200.00, 'Business lodging', ?, 0)"
        )->execute([$expTypeId, $claimId, $expTypeId, $claimId]);
    }

    // 10. Sync hs_hr_unique_id so PIM Add Employee never collides
    $maxEmp = (int)$pdo->query("SELECT COALESCE(MAX(emp_number), 1) FROM hs_hr_employee")->fetchColumn();
    $pdo->prepare("UPDATE hs_hr_unique_id SET last_id = ? WHERE table_name = 'hs_hr_employee' AND field_name = 'emp_number'")
        ->execute([$maxEmp]);

    $pdo->commit();

    echo json_encode([
        'status' => 'SEEDED',
        'database' => $db,
        'employees' => [
            'EMP-IN-001 (Aarav Sharma, KA New 12.75L + 1d LWP + Rs.3450 Claim)' => $empAarav,
            'EMP-IN-002 (Meera Nair, fin.approver SoD Role 8, KA Old 1.5L/mo)' => $empMeera,
            'EMP-IN-003 (Rajesh Kumar, MH ESIC 18k/mo + 8h OT)' => $empRajesh,
            'EMP-IN-004 (Ananya Das, WB 42k/mo, No Bank Warning, Paid+Half LWP)' => $empAnanya,
            'EMP-IN-005 (Vikram Patel, Terminated skip edge case)' => 'terminated',
            'EMP-IN-006 (Sneha Iyer, USD skip edge case)' => 'usd_currency',
        ],
    ], JSON_PRETTY_PRINT) . "\n";
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    fwrite(STDERR, "Seed failed: " . $e->getMessage() . "\n");
    exit(1);
}
