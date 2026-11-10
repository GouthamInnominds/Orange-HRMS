# OrangeHRM v1.0 Code Component Mapping (Evidence-Based)

## 1.0 Code Component Mapping Overview
This document establishes the verified mappings between high-level business capabilities and actual PHP classes, endpoints, and database entities extracted from the repository (`commit 4b88be2`).

---

## 2.0 Core Plugin Mappings

### 2.1 Personal Information Management (`orangehrmPimPlugin`)
- **Business Capabilities:** Employee Master, Personal Details, Job Details, Salary, Emergency Contacts, Dependents, Immigration.
- **Key API Classes:**
  - `OrangeHRM\Pim\Api\EmployeeAPI`
  - `OrangeHRM\Pim\Api\EmployeeContactDetailsAPI`
  - `OrangeHRM\Pim\Api\EmployeePictureAPI`
  - `OrangeHRM\Pim\Api\EmployeeCustomFieldAPI`
  - `OrangeHRM\Pim\Api\EmployeeTerminationAPI`
- **Key Services:**
  - `OrangeHRM\Pim\Service\EmployeeService`
  - `OrangeHRM\Pim\Service\EmployeePictureService`
- **Key DAOs:**
  - `OrangeHRM\Pim\Dao\EmployeeDao`
- **Key Doctrine Entities & Tables:**
  - `OrangeHRM\Entity\Employee` (`ohrm_employee`)
  - `OrangeHRM\Entity\EmpPicture` (`ohrm_emp_picture`)
  - `OrangeHRM\Entity\EmpContactDetail` (`ohrm_emp_contact_detail`)
  - `OrangeHRM\Entity\EmpEmergencyContact` (`ohrm_emp_emergency_contact`)
  - `OrangeHRM\Entity\EmpDependent` (`ohrm_emp_dependents`)
  - `OrangeHRM\Entity\EmpPassport` (`ohrm_emp_passport`)
  - `OrangeHRM\Entity\EmpSalary` (`ohrm_emp_salary`)

### 2.2 System Administration (`orangehrmAdminPlugin`)
- **Business Capabilities:** Organization Structure, Job Titles, Pay Grades, User Roles, Employment Status.
- **Key API Classes:**
  - `OrangeHRM\Admin\Api\JobTitleAPI`
  - `OrangeHRM\Admin\Api\JobSpecificationAPI`
  - `OrangeHRM\Admin\Api\JobCategoryAPI`
  - `OrangeHRM\Admin\Api\PayGradeAPI`
  - `OrangeHRM\Admin\Api\EmploymentStatusAPI`
  - `OrangeHRM\Admin\Api\SubunitAPI`
  - `OrangeHRM\Admin\Api\UserAPI`
- **Key Services & DAOs:**
  - `OrangeHRM\Admin\Service\JobTitleService`
  - `OrangeHRM\Admin\Service\UserService`
  - `OrangeHRM\Admin\Dao\JobTitleDao`
  - `OrangeHRM\Admin\Dao\UserDao`
- **Key Doctrine Entities & Tables:**
  - `OrangeHRM\Entity\JobTitle` (`ohrm_job_title`)
  - `OrangeHRM\Entity\JobCategory` (`ohrm_job_category`)
  - `OrangeHRM\Entity\PayGrade` (`ohrm_pay_grade`)
  - `OrangeHRM\Entity\EmploymentStatus` (`ohrm_employment_status`)
  - `OrangeHRM\Entity\Subunit` (`ohrm_subunit`)
  - `OrangeHRM\Entity\User` (`ohrm_user`)
  - `OrangeHRM\Entity\UserRole` (`ohrm_user_role`)

### 2.3 Leave Management (`orangehrmLeavePlugin`)
- **Business Capabilities:** Leave Types, Leave Entitlements, Leave Applications, Approvals, Holidays, Work Week.
- **Key API Classes:**
  - `OrangeHRM\Leave\Api\LeaveTypeAPI`
  - `OrangeHRM\Leave\Api\LeaveEntitlementAPI`
  - `OrangeHRM\Leave\Api\LeaveRequestAPI`
  - `OrangeHRM\Leave\Api\LeavePeriodAPI`
  - `OrangeHRM\Leave\Api\HolidayAPI`
  - `OrangeHRM\Leave\Api\WorkWeekAPI`
- **Key Doctrine Entities & Tables:**
  - `OrangeHRM\Entity\LeaveType` (`ohrm_leave_type`)
  - `OrangeHRM\Entity\LeaveEntitlement` (`ohrm_leave_entitlement`)
  - `OrangeHRM\Entity\LeaveRequest` (`ohrm_leave_request`)
  - `OrangeHRM\Entity\Leave` (`ohrm_leave`)
  - `OrangeHRM\Entity\Holiday` (`ohrm_holiday`)
  - `OrangeHRM\Entity\WorkWeek` (`ohrm_work_week`)

### 2.4 Time & Timesheet Management (`orangehrmTimePlugin` & `orangehrmAttendancePlugin`)
- **Business Capabilities:** Punch In/Out, Customer/Project Tracking, Timesheets.
- **Key API Classes:**
  - `OrangeHRM\Attendance\Api\AttendanceRecordAPI`
  - `OrangeHRM\Time\Api\TimesheetAPI`
  - `OrangeHRM\Time\Api\TimesheetItemAPI`
  - `OrangeHRM\Time\Api\ProjectAPI`
  - `OrangeHRM\Time\Api\CustomerAPI`
  - `OrangeHRM\Time\Api\ProjectActivityAPI`
- **Key Doctrine Entities & Tables:**
  - `OrangeHRM\Entity\AttendanceRecord` (`ohrm_attendance_record`)
  - `OrangeHRM\Entity\Timesheet` (`ohrm_timesheet`)
  - `OrangeHRM\Entity\TimesheetItem` (`ohrm_timesheet_item`)
  - `OrangeHRM\Entity\Project` (`ohrm_project`)
  - `OrangeHRM\Entity\Customer` (`ohrm_customer`)
  - `OrangeHRM\Entity\ProjectActivity` (`ohrm_project_activity`)

