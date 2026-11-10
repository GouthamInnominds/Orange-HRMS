# OrangeHRM v1.0 API Inventory (Evidence-Based)

> Extracted automatically from `routes.yaml` across all 22 plugins.
> Total Registered Routes: **501**

| Plugin | Route Name | HTTP Methods | Path | Controller / API Handler |
| :--- | :--- | :--- | :--- | :--- |
| `orangehrmAdminPlugin` | `apiv2_admin_job_title` | `GET, PUT` | `/api/v2/admin/job-titles/{id}` | `OrangeHRM\Admin\Api\JobTitleAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_job_titles` | `GET, POST, DELETE` | `/api/v2/admin/job-titles` | `OrangeHRM\Admin\Api\JobTitleAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_job_specification` | `GET, PUT, DELETE` | `/api/v2/admin/job-titles/{jobTitleId}/specification` | `OrangeHRM\Admin\Api\JobSpecificationAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_job_category` | `GET, PUT` | `/api/v2/admin/job-categories/{id}` | `OrangeHRM\Admin\Api\JobCategoryAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_job_categories` | `GET, POST, DELETE` | `/api/v2/admin/job-categories` | `OrangeHRM\Admin\Api\JobCategoryAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_user` | `GET, PUT` | `/api/v2/admin/users/{id}` | `OrangeHRM\Admin\Api\UserAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_users` | `GET, POST, DELETE` | `/api/v2/admin/users` | `OrangeHRM\Admin\Api\UserAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_subunit` | `GET, PUT, DELETE` | `/api/v2/admin/subunits/{id}` | `OrangeHRM\Admin\Api\SubunitAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_subunits` | `GET, POST` | `/api/v2/admin/subunits` | `OrangeHRM\Admin\Api\SubunitAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_employment_status` | `GET, PUT` | `/api/v2/admin/employment-statuses/{id}` | `OrangeHRM\Admin\Api\EmploymentStatusAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_employment_statuses` | `GET, POST, DELETE` | `/api/v2/admin/employment-statuses` | `OrangeHRM\Admin\Api\EmploymentStatusAPI` |
| `orangehrmAdminPlugin` | `apiv2_education` | `GET, PUT` | `/api/v2/admin/educations/{id}` | `OrangeHRM\Admin\Api\EducationAPI` |
| `orangehrmAdminPlugin` | `apiv2_educations` | `GET, POST, DELETE` | `/api/v2/admin/educations` | `OrangeHRM\Admin\Api\EducationAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_skill` | `GET, PUT` | `/api/v2/admin/skills/{id}` | `OrangeHRM\Admin\Api\SkillAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_skills` | `GET, POST, DELETE` | `/api/v2/admin/skills` | `OrangeHRM\Admin\Api\SkillAPI` |
| `orangehrmAdminPlugin` | `apiv2_license` | `GET, PUT` | `/api/v2/admin/licenses/{id}` | `OrangeHRM\Admin\Api\LicenseAPI` |
| `orangehrmAdminPlugin` | `apiv2_licenses` | `GET, POST, DELETE` | `/api/v2/admin/licenses` | `OrangeHRM\Admin\Api\LicenseAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_language` | `GET, PUT` | `/api/v2/admin/languages/{id}` | `OrangeHRM\Admin\Api\LanguageAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_languages` | `GET, POST, DELETE` | `/api/v2/admin/languages` | `OrangeHRM\Admin\Api\LanguageAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_membership` | `GET, PUT` | `/api/v2/admin/memberships/{id}` | `OrangeHRM\Admin\Api\MembershipAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_memberships` | `GET, POST, DELETE` | `/api/v2/admin/memberships` | `OrangeHRM\Admin\Api\MembershipAPI` |
| `orangehrmAdminPlugin` | `apiv2_organization` | `GET, PUT` | `/api/v2/admin/organization` | `OrangeHRM\Admin\Api\OrganizationAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_pay_grade_allowed_currencies` | `GET` | `/api/v2/admin/pay-grades/{payGradeId}/currencies/allowed` | `OrangeHRM\Admin\Api\PayGradeAllowedCurrencyAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_paygrades_currency` | `GET, PUT` | `/api/v2/admin/pay-grades/{payGradeId}/currencies/{id}` | `OrangeHRM\Admin\Api\PayGradeCurrencyAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_paygrades_currencies` | `GET, POST, DELETE` | `/api/v2/admin/pay-grades/{payGradeId}/currencies` | `OrangeHRM\Admin\Api\PayGradeCurrencyAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_nationality` | `GET, PUT` | `/api/v2/admin/nationalities/{id}` | `OrangeHRM\Admin\Api\NationalityAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_nationalities` | `GET, POST, DELETE` | `/api/v2/admin/nationalities` | `OrangeHRM\Admin\Api\NationalityAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_email_configuration` | `GET, PUT` | `/api/v2/admin/email-configuration` | `OrangeHRM\Admin\Api\EmailConfigurationAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_work_shift` | `GET, PUT` | `/api/v2/admin/work-shifts/{id}` | `OrangeHRM\Admin\Api\WorkShiftAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_work_shifts` | `GET, POST, DELETE` | `/api/v2/admin/work-shifts` | `OrangeHRM\Admin\Api\WorkShiftAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_work_shifts_employee` | `GET` | `/api/v2/admin/work-shifts/employees` | `OrangeHRM\Admin\Api\WorkShiftEmployeeAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_location` | `GET, PUT` | `/api/v2/admin/locations/{id}` | `OrangeHRM\Admin\Api\LocationAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_locations` | `GET, POST, DELETE` | `/api/v2/admin/locations` | `OrangeHRM\Admin\Api\LocationAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_modules` | `GET, PUT` | `/api/v2/admin/modules` | `OrangeHRM\Admin\Api\ModulesAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_pay_grades` | `GET, POST, DELETE` | `/api/v2/admin/pay-grades` | `OrangeHRM\Admin\Api\PayGradeAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_pay_grade` | `GET, PUT` | `/api/v2/admin/pay-grades/{id}` | `OrangeHRM\Admin\Api\PayGradeAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_email_subscription` | `PUT` | `/api/v2/admin/email-subscriptions/{id}` | `OrangeHRM\Admin\Api\EmailSubscriptionAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_email_subscriptions` | `GET` | `/api/v2/admin/email-subscriptions` | `OrangeHRM\Admin\Api\EmailSubscriptionAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_email_subscribers` | `GET, POST, DELETE` | `/api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers` | `OrangeHRM\Admin\Api\EmailSubscriberAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_email_subscriber` | `GET, PUT` | `/api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers/{id}` | `OrangeHRM\Admin\Api\EmailSubscriberAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_validate_user_name` | `GET` | `/api/v2/admin/validation/user-name` | `OrangeHRM\Admin\Api\ValidationUserNameAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_localization` | `GET, PUT` | `/api/v2/admin/localization` | `OrangeHRM\Admin\Api\LocalizationAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_i18n_languages` | `GET, DELETE` | `/api/v2/admin/i18n/languages` | `OrangeHRM\Admin\Api\I18NLanguageAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_i18n_translation_import` | `POST` | `/api/v2/admin/i18n/languages/{languageId}/import` | `OrangeHRM\Admin\Api\I18NTranslationImportAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_i18n_language` | `GET, PUT` | `/api/v2/admin/i18n/languages/{id}` | `OrangeHRM\Admin\Api\I18NLanguageAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_i18n_language_translations` | `GET` | `/api/v2/admin/i18n/languages/{languageId}/translations` | `OrangeHRM\Admin\Api\I18NTranslationAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_i18n_language_bulk_translations` | `PUT` | `/api/v2/admin/i18n/languages/{languageId}/translations/bulk` | `OrangeHRM\Admin\Api\I18NTranslationBulkAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_i18n_groups` | `GET` | `/api/v2/admin/i18n/groups` | `OrangeHRM\Admin\Api\I18NGroupAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_i18n_translation_validation` | `GET` | `/api/v2/admin/i18n/translation/{langStringId}/validate` | `OrangeHRM\Admin\Api\I18NTranslationValidationAPI` |
| `orangehrmAdminPlugin` | `apiv2_admin_i18n_language_translation_errors` | `GET` | `/api/v2/admin/i18n/languages/{languageId}/translations/errors` | `OrangeHRM\Admin\Api\I18NImportErrorAPI` |
| `orangehrmAdminPlugin` | `admin_job_specification_attachment` | `GET` | `/admin/viewJobSpecification/attachId/{attachId}` | `OrangeHRM\Admin\Controller\File\JobSpecification::handle` |
| `orangehrmAdminPlugin` | `admin_language_package_attachment` | `GET` | `/admin/viewLanguagePackage/languageId/{languageId}` | `OrangeHRM\Admin\Controller\File\LanguagePackage::handle` |
| `orangehrmAdminPlugin` | `admin_module` | `GET` | `/admin/viewAdminModule` | `OrangeHRM\Admin\Controller\AdminModuleController::handle` |
| `orangehrmAdminPlugin` | `view_job_title` | `GET` | `/admin/viewJobTitleList` | `OrangeHRM\Admin\Controller\JobTitleController::handle` |
| `orangehrmAdminPlugin` | `save_job_title` | `GET` | `/admin/saveJobTitle` | `OrangeHRM\Admin\Controller\SaveJobTitleController::handle` |
| `orangehrmAdminPlugin` | `edit_job_title` | `GET` | `/admin/saveJobTitle/{id}` | `OrangeHRM\Admin\Controller\SaveJobTitleController::handle` |
| `orangehrmAdminPlugin` | `view_job_category` | `GET` | `/admin/jobCategory` | `OrangeHRM\Admin\Controller\JobCategoryController::handle` |
| `orangehrmAdminPlugin` | `save_job_category` | `GET` | `/admin/saveJobCategory` | `OrangeHRM\Admin\Controller\SaveJobCategoryController::handle` |
| `orangehrmAdminPlugin` | `edit_job_category` | `GET` | `/admin/saveJobCategory/{id}` | `OrangeHRM\Admin\Controller\SaveJobCategoryController::handle` |
| `orangehrmAdminPlugin` | `view_employment_status` | `GET` | `/admin/employmentStatus` | `OrangeHRM\Admin\Controller\EmploymentStatusController::handle` |
| `orangehrmAdminPlugin` | `save_employment_status` | `GET` | `/admin/saveEmploymentStatus` | `OrangeHRM\Admin\Controller\SaveEmploymentStatusController::handle` |
| `orangehrmAdminPlugin` | `edit_employment_status` | `GET` | `/admin/saveEmploymentStatus/{id}` | `OrangeHRM\Admin\Controller\SaveEmploymentStatusController::handle` |
| `orangehrmAdminPlugin` | `view_system_users` | `GET` | `/admin/viewSystemUsers` | `OrangeHRM\Admin\Controller\SystemUserController::handle` |
| `orangehrmAdminPlugin` | `save_system_users` | `GET` | `/admin/saveSystemUser` | `OrangeHRM\Admin\Controller\SaveSystemUserController::handle` |
| `orangehrmAdminPlugin` | `edit_system_users` | `GET` | `/admin/saveSystemUser/{id}` | `OrangeHRM\Admin\Controller\SaveSystemUserController::handle` |
| `orangehrmAdminPlugin` | `view_organization_structure` | `GET` | `/admin/viewCompanyStructure` | `OrangeHRM\Admin\Controller\OrganizationStructureController::handle` |
| `orangehrmAdminPlugin` | `view_education` | `GET` | `/admin/viewEducation` | `OrangeHRM\Admin\Controller\QualificationEducationController::handle` |
| `orangehrmAdminPlugin` | `save_education` | `GET` | `/admin/saveEducation` | `OrangeHRM\Admin\Controller\SaveQualificationEducationController::handle` |
| `orangehrmAdminPlugin` | `edit_education` | `GET` | `/admin/saveEducation/{id}` | `OrangeHRM\Admin\Controller\SaveQualificationEducationController::handle` |
| `orangehrmAdminPlugin` | `view_qualification_skills` | `GET` | `/admin/viewSkills` | `OrangeHRM\Admin\Controller\QualificationSkillController::handle` |
| `orangehrmAdminPlugin` | `save_qualification_skills` | `GET` | `/admin/saveSkills` | `OrangeHRM\Admin\Controller\SaveQualificationSkillController::handle` |
| `orangehrmAdminPlugin` | `edit_qualification_skills` | `GET` | `/admin/saveSkills/{id}` | `OrangeHRM\Admin\Controller\SaveQualificationSkillController::handle` |
| `orangehrmAdminPlugin` | `view_license` | `GET` | `/admin/viewLicenses` | `OrangeHRM\Admin\Controller\QualificationLicenseController::handle` |
| `orangehrmAdminPlugin` | `save_license` | `GET` | `/admin/saveLicenses` | `OrangeHRM\Admin\Controller\SaveQualificationLicenseController::handle` |
| `orangehrmAdminPlugin` | `edit_license` | `GET` | `/admin/saveLicenses/{id}` | `OrangeHRM\Admin\Controller\SaveQualificationLicenseController::handle` |
| `orangehrmAdminPlugin` | `view_qualification_languages` | `GET` | `/admin/viewLanguages` | `OrangeHRM\Admin\Controller\QualificationLanguageController::handle` |
| `orangehrmAdminPlugin` | `save_qualification_languages` | `GET` | `/admin/saveLanguages` | `OrangeHRM\Admin\Controller\SaveQualificationLanguageController::handle` |
| `orangehrmAdminPlugin` | `edit_qualification_languages` | `GET` | `/admin/saveLanguages/{id}` | `OrangeHRM\Admin\Controller\SaveQualificationLanguageController::handle` |
| `orangehrmAdminPlugin` | `view_qualification_memberships` | `GET` | `/admin/membership` | `OrangeHRM\Admin\Controller\QualificationMembershipController::handle` |
| `orangehrmAdminPlugin` | `save_qualification_memberships` | `GET` | `/admin/saveMemberships` | `OrangeHRM\Admin\Controller\SaveQualificationMembershipController::handle` |
| `orangehrmAdminPlugin` | `edit_qualification_memberships` | `GET` | `/admin/saveMemberships/{id}` | `OrangeHRM\Admin\Controller\SaveQualificationMembershipController::handle` |
| `orangehrmAdminPlugin` | `view_organization_general_info` | `GET` | `/admin/viewOrganizationGeneralInformation` | `OrangeHRM\Admin\Controller\ViewOrganizationGeneralInformationController::handle` |
| `orangehrmAdminPlugin` | `view_nationality` | `GET` | `/admin/nationality` | `OrangeHRM\Admin\Controller\NationalityController::handle` |
| `orangehrmAdminPlugin` | `save_nationality` | `GET` | `/admin/saveNationality` | `OrangeHRM\Admin\Controller\SaveNationalityController::handle` |
| `orangehrmAdminPlugin` | `edit_nationality` | `GET` | `/admin/saveNationality/{id}` | `OrangeHRM\Admin\Controller\SaveNationalityController::handle` |
| `orangehrmAdminPlugin` | `view_location` | `GET` | `/admin/viewLocations` | `OrangeHRM\Admin\Controller\ViewLocationController::handle` |
| `orangehrmAdminPlugin` | `save_location` | `GET` | `/admin/saveLocation` | `OrangeHRM\Admin\Controller\SaveLocationController::handle` |
| `orangehrmAdminPlugin` | `edit_location` | `GET` | `/admin/saveLocation/{id}` | `OrangeHRM\Admin\Controller\SaveLocationController::handle` |
| `orangehrmAdminPlugin` | `view_email_configuration` | `GET` | `/admin/listMailConfiguration` | `OrangeHRM\Admin\Controller\ViewEmailConfigurationController::handle` |
| `orangehrmAdminPlugin` | `view_pay_grades` | `GET` | `/admin/viewPayGrades` | `OrangeHRM\Admin\Controller\PayGradeController::handle` |
| `orangehrmAdminPlugin` | `add_pay_grade` | `GET` | `/admin/payGrade` | `OrangeHRM\Admin\Controller\SavePayGradeController::handle` |
| `orangehrmAdminPlugin` | `edit_pay_grade` | `GET` | `/admin/payGrade/{id}` | `OrangeHRM\Admin\Controller\SavePayGradeController::handle` |
| `orangehrmAdminPlugin` | `edit_module_configuration` | `GET` | `/admin/viewModules` | `OrangeHRM\Admin\Controller\SaveModuleConfigurationController::handle` |
| `orangehrmAdminPlugin` | `view_work_shift` | `GET` | `/admin/workShift` | `OrangeHRM\Admin\Controller\WorkShiftController::handle` |
| `orangehrmAdminPlugin` | `save_work_shift` | `GET` | `/admin/saveWorkShifts` | `OrangeHRM\Admin\Controller\SaveWorkShiftController::handle` |
| `orangehrmAdminPlugin` | `edit_work_shift` | `GET` | `/admin/saveWorkShifts/{id}` | `OrangeHRM\Admin\Controller\SaveWorkShiftController::handle` |
| `orangehrmAdminPlugin` | `view_email_subscription` | `GET` | `/admin/viewEmailNotification` | `OrangeHRM\Admin\Controller\EmailSubscriptionController::handle` |
| `orangehrmAdminPlugin` | `edit_email_subscription` | `GET` | `/admin/saveSubscriber/{id}` | `OrangeHRM\Admin\Controller\SaveEmailSubscriptionController::handle` |
| `orangehrmAdminPlugin` | `admin_localization` | `GET` | `/admin/localization` | `OrangeHRM\Admin\Controller\LocalizationController::handle` |
| `orangehrmAdminPlugin` | `admin_open_id_provider` | `GET` | `/admin/openIdProvider` | `OrangeHRM\OpenidAuthentication\Controller\SocialMediaAuthenticationController::handle` |
| `orangehrmAdminPlugin` | `admin_language_package` | `GET` | `/admin/languagePackage` | `OrangeHRM\Admin\Controller\LanguagePackageController::handle` |
| `orangehrmAdminPlugin` | `admin_language_package_import` | `GET` | `/admin/languageImport/{languageId}` | `OrangeHRM\Admin\Controller\LanguageImportController::handle` |
| `orangehrmAdminPlugin` | `admin_language_package_fix_errors` | `GET` | `/admin/fixLanguageStringErrors/{languageId}` | `OrangeHRM\Admin\Controller\FixLanguageStringErrorsController::handle` |
| `orangehrmAdminPlugin` | `admin_language_translation` | `GET` | `/admin/languageCustomization/{languageId}` | `OrangeHRM\Admin\Controller\LanguageTranslationController::handle` |
| `orangehrmAdminPlugin` | `admin_ldap_configuration` | `GET` | `/admin/ldapConfiguration` | `OrangeHRM\Admin\Controller\LdapConfigurationController::handle` |
| `orangehrmAttendancePlugin` | `apiv2_attendance_configuration` | `GET, PUT` | `/api/v2/attendance/configs` | `OrangeHRM\Attendance\Api\AttendanceConfigurationAPI` |
| `orangehrmAttendancePlugin` | `apiv2_employee_latest_attendance_record` | `GET` | `/api/v2/attendance/records/latest` | `OrangeHRM\Attendance\Api\EmployeeLatestAttendanceRecordAPI` |
| `orangehrmAttendancePlugin` | `apiv2_attendance_punch_in_record_overlap` | `GET` | `/api/v2/attendance/punch-in/overlaps` | `OrangeHRM\Attendance\Api\AttendancePunchInRecordOverlapAPI` |
| `orangehrmAttendancePlugin` | `apiv2_attendance_punch_out_record_overlap` | `GET` | `/api/v2/attendance/punch-out/overlaps` | `OrangeHRM\Attendance\Api\AttendancePunchOutRecordOverlapAPI` |
| `orangehrmAttendancePlugin` | `apiv2_attendance_my_attendance_records` | `GET, POST, PUT, DELETE` | `/api/v2/attendance/records` | `OrangeHRM\Attendance\Api\MyAttendanceRecordAPI` |
| `orangehrmAttendancePlugin` | `apiv2_attendance_employee_attendance_records` | `GET, POST, PUT, DELETE` | `/api/v2/attendance/employees/{empNumber}/records` | `OrangeHRM\Attendance\Api\EmployeeAttendanceRecordAPI` |
| `orangehrmAttendancePlugin` | `apiv2_attendance_employee_attendance_record_summary` | `GET` | `/api/v2/attendance/employees/summary` | `OrangeHRM\Attendance\Api\EmployeeAttendanceSummaryAPI` |
| `orangehrmAttendancePlugin` | `apiv2_attendance_timezones` | `GET` | `/api/v2/attendance/timezones` | `OrangeHRM\Attendance\Api\TimezonesAPI` |
| `orangehrmAttendancePlugin` | `apiv2_attendance_current_datetime` | `GET` | `/api/v2/attendance/current-datetime` | `OrangeHRM\Attendance\Api\CurrentDateTimeAPI` |
| `orangehrmAttendancePlugin` | `apiv2_attendance_edit_punch_in_record_overlap` | `GET` | `/api/v2/attendance/records/punch-in-overlaps` | `OrangeHRM\Attendance\Api\AttendanceEditPunchInRecordOverlapAPI` |
| `orangehrmAttendancePlugin` | `apiv2_attendance_edit_punch_out_record_overlap` | `GET` | `/api/v2/attendance/records/punch-out-overlaps` | `OrangeHRM\Attendance\Api\AttendanceEditPunchOutRecordOverlapAPI` |
| `orangehrmAttendancePlugin` | `apiv2_attendance_employee_attendance_record` | `GET, PUT` | `/api/v2/attendance/records/{id}` | `OrangeHRM\Attendance\Api\AttendanceRecordAPI` |
| `orangehrmAttendancePlugin` | `attendance_punch_in` | `GET` | `/attendance/punchIn` | `OrangeHRM\Attendance\Controller\PunchInController::handle` |
| `orangehrmAttendancePlugin` | `attendance_punch_out` | `GET` | `/attendance/punchOut` | `OrangeHRM\Attendance\Controller\PunchOutController::handle` |
| `orangehrmAttendancePlugin` | `attendance_configure` | `GET` | `/attendance/configure` | `OrangeHRM\Attendance\Controller\AttendanceConfigurationController::handle` |
| `orangehrmAttendancePlugin` | `attendance_view_employee_attendance` | `GET` | `/attendance/viewAttendanceRecord` | `OrangeHRM\Attendance\Controller\ViewEmployeeAttendanceController::handle` |
| `orangehrmAttendancePlugin` | `attendance_view_my_attendance` | `GET` | `/attendance/viewMyAttendanceRecord` | `OrangeHRM\Attendance\Controller\ViewMyAttendanceController::handle` |
| `orangehrmAttendancePlugin` | `attendance_edit_attendance` | `GET` | `/attendance/editAttendanceRecord/{id}` | `OrangeHRM\Attendance\Controller\EditAttendanceController::handle` |
| `orangehrmAttendancePlugin` | `attendance_summary_report` | `GET` | `/time/displayAttendanceSummaryReportCriteria` | `OrangeHRM\Attendance\Controller\AttendanceSummaryReportController::handle` |
| `orangehrmAttendancePlugin` | `attendance_employee_punch_in_out` | `GET` | `/attendance/proxyPunchInPunchOut` | `OrangeHRM\Attendance\Controller\EmployeePunchInOutController::handle` |
| `orangehrmAttendancePlugin` | `attendance_employee_edit_attendance` | `GET` | `/attendance/editEmployeeAttendanceRecord/{id}` | `OrangeHRM\Attendance\Controller\EditEmployeeAttendanceController::handle` |
| `orangehrmAuthenticationPlugin` | `apiv2_auth_public_validation_password` | `POST` | `/api/v2/auth/public/validation/password` | `OrangeHRM\Authentication\PublicApi\PasswordStrengthValidationAPI` |
| `orangehrmAuthenticationPlugin` | `root` | `GET` | `/` | `OrangeHRM\Authentication\Controller\RootController::handle` |
| `orangehrmAuthenticationPlugin` | `auth_login` | `GET` | `/auth/login` | `OrangeHRM\Authentication\Controller\LoginController::handle` |
| `orangehrmAuthenticationPlugin` | `auth_validate` | `POST` | `/auth/validate` | `OrangeHRM\Authentication\Controller\ValidateController::handle` |
| `orangehrmAuthenticationPlugin` | `auth_logout` | `GET` | `/auth/logout` | `OrangeHRM\Authentication\Controller\LogoutController::handle` |
| `orangehrmAuthenticationPlugin` | `auth_admin_access_verify` | `POST` | `/auth/adminVerify` | `OrangeHRM\Authentication\Controller\AdministratorVerifyController::handle` |
| `orangehrmAuthenticationPlugin` | `auth_request_reset_password` | `POST` | `/auth/requestResetPassword` | `OrangeHRM\Authentication\Controller\RequestResetPasswordController::handle` |
| `orangehrmAuthenticationPlugin` | `auth_reset_password` | `POST` | `/auth/resetPassword` | `OrangeHRM\Authentication\Controller\ResetPasswordController::handle` |
| `orangehrmAuthenticationPlugin` | `auth_send_password_reset` | `GET` | `/auth/sendPasswordReset` | `OrangeHRM\Authentication\Controller\RequestPasswordSuccessController::handle` |
| `orangehrmAuthenticationPlugin` | `auth_send_password_reset_failure` | `GET` | `/auth/sendPasswordResetFailure` | `OrangeHRM\Authentication\Controller\RequestPasswordFailureController::handle` |
| `orangehrmAuthenticationPlugin` | `auth_forgot_password_username` | `GET` | `/auth/requestPasswordResetCode` | `OrangeHRM\Authentication\Controller\RequestPasswordController::handle` |
| `orangehrmAuthenticationPlugin` | `auth_reset_code` | `GET` | `/auth/resetPassword/resetCode/{resetCode}` | `OrangeHRM\Authentication\Controller\ResetCodeController::handle` |
| `orangehrmAuthenticationPlugin` | `auth_weak_password_reset` | `GET` | `/auth/changeWeakPassword/resetCode/{resetCode}` | `OrangeHRM\Authentication\Controller\WeakPasswordResetController::handle` |
| `orangehrmAuthenticationPlugin` | `auth_request_enforce_password` | `POST` | `/auth/resetWeakPassword` | `OrangeHRM\Authentication\Controller\RequestResetWeakPasswordController::handle` |
| `orangehrmBuzzPlugin` | `apiv2_buzz_feed` | `GET` | `/api/v2/buzz/feed` | `OrangeHRM\Buzz\Api\BuzzFeedAPI` |
| `orangehrmBuzzPlugin` | `apiv2_buzz_upcoming_anniversary` | `GET` | `/api/v2/buzz/anniversaries` | `OrangeHRM\Buzz\Api\EmployeeAnniversaryAPI` |
| `orangehrmBuzzPlugin` | `apiv2_buzz_posts` | `POST` | `/api/v2/buzz/posts` | `OrangeHRM\Buzz\Api\BuzzPostAPI` |
| `orangehrmBuzzPlugin` | `apiv2_buzz_shares` | `POST` | `/api/v2/buzz/shares` | `OrangeHRM\Buzz\Api\BuzzShareAPI` |
| `orangehrmBuzzPlugin` | `apiv2_buzz_share` | `PUT, DELETE` | `/api/v2/buzz/shares/{id}` | `OrangeHRM\Buzz\Api\BuzzShareAPI` |
| `orangehrmBuzzPlugin` | `apiv2_buzz_comments` | `GET, POST` | `/api/v2/buzz/shares/{shareId}/comments` | `OrangeHRM\Buzz\Api\BuzzCommentAPI` |
| `orangehrmBuzzPlugin` | `apiv2_buzz_comment` | `GET, PUT, DELETE` | `/api/v2/buzz/shares/{shareId}/comments/{commentId}` | `OrangeHRM\Buzz\Api\BuzzCommentAPI` |
| `orangehrmBuzzPlugin` | `aapiv2_buzz_video_url_validation` | `GET` | `/api/v2/buzz/validation/links` | `OrangeHRM\Buzz\Api\BuzzVideoURLValidationAPI` |
| `orangehrmBuzzPlugin` | `apiv2_buzz_like_on_share` | `GET, POST, DELETE` | `/api/v2/buzz/shares/{shareId}/likes` | `OrangeHRM\Buzz\Api\BuzzLikeOnShareAPI` |
| `orangehrmBuzzPlugin` | `apiv2_buzz_comment_on_share` | `GET, POST, DELETE` | `/api/v2/buzz/comments/{commentId}/likes` | `OrangeHRM\Buzz\Api\BuzzLikeOnCommentAPI` |
| `orangehrmBuzzPlugin` | `apiv2_buzz_post` | `GET, PUT` | `/api/v2/buzz/posts/{id}` | `OrangeHRM\Buzz\Api\BuzzPostAPI` |
| `orangehrmBuzzPlugin` | `apiv2_buzz_post_share` | `GET` | `/api/v2/buzz/posts/{postId}/shares` | `OrangeHRM\Buzz\Api\BuzzPostShareAPI` |
| `orangehrmBuzzPlugin` | `buzz_photo` | `GET` | `/buzz/photo/{id}` | `OrangeHRM\Buzz\Controller\File\BuzzPhotoController::handle` |
| `orangehrmBuzzPlugin` | `buzz_module` | `GET` | `/buzz/viewBuzz` | `OrangeHRM\Buzz\Controller\BuzzController::handle` |
| `orangehrmClaimPlugin` | `apiv2_claim_events` | `POST, GET, DELETE` | `/api/v2/claim/events` | `OrangeHRM\Claim\Api\ClaimEventAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_event` | `GET, PUT` | `/api/v2/claim/events/{id}` | `OrangeHRM\Claim\Api\ClaimEventAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_expense_types` | `POST, GET, DELETE` | `/api/v2/claim/expenses/types` | `OrangeHRM\Claim\Api\ClaimExpenseTypeAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_expense_type` | `GET, PUT` | `/api/v2/claim/expenses/types/{id}` | `OrangeHRM\Claim\Api\ClaimExpenseTypeAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_expenses` | `POST, GET, DELETE` | `/api/v2/claim/requests/{requestId}/expenses` | `OrangeHRM\Claim\Api\ClaimExpenseAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_expense` | `GET, PUT` | `/api/v2/claim/requests/{requestId}/expenses/{id}` | `OrangeHRM\Claim\Api\ClaimExpenseAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_attachments` | `POST, GET, DELETE` | `/api/v2/claim/requests/{requestId}/attachments` | `OrangeHRM\Claim\Api\ClaimAttachmentAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_attachment` | `GET, PUT` | `/api/v2/claim/requests/{requestId}/attachments/{id}` | `OrangeHRM\Claim\Api\ClaimAttachmentAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_my_claim_requests` | `POST, GET` | `/api/v2/claim/requests` | `OrangeHRM\Claim\Api\MyClaimRequestAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_my_claim_request` | `GET` | `/api/v2/claim/requests/{id}` | `OrangeHRM\Claim\Api\MyClaimRequestAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_employee_claim_requests` | `POST` | `/api/v2/claim/employees/{empNumber}/requests` | `OrangeHRM\Claim\Api\EmployeeClaimRequestAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_employees_claim_requests` | `GET` | `/api/v2/claim/employees/requests` | `OrangeHRM\Claim\Api\EmployeeClaimRequestAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_employee_claim_request` | `GET` | `/api/v2/claim/employees/{empNumber}/requests/{id}` | `OrangeHRM\Claim\Api\EmployeeClaimRequestAPI` |
| `orangehrmClaimPlugin` | `apiv2_claim_claim_request_action` | `PUT, GET` | `/api/v2/claim/requests/{requestId}/action` | `OrangeHRM\Claim\Api\ClaimRequestActionAPI` |
| `orangehrmClaimPlugin` | `claim_module` | `GET` | `/claim/viewClaimModule` | `OrangeHRM\Claim\Controller\ClaimModuleController::handle` |
| `orangehrmClaimPlugin` | `claim_events` | `GET` | `/claim/viewEvents` | `OrangeHRM\Claim\Controller\ClaimController::handle` |
| `orangehrmClaimPlugin` | `claim_save_claim_events` | `GET` | `/claim/saveEvents` | `OrangeHRM\Claim\Controller\SaveClaimController::handle` |
| `orangehrmClaimPlugin` | `claim_edit_claim_events` | `GET` | `/claim/saveEvents/{id}` | `OrangeHRM\Claim\Controller\SaveClaimController::handle` |
| `orangehrmClaimPlugin` | `claim_claim_expense_types` | `GET` | `/claim/viewExpense` | `OrangeHRM\Claim\Controller\ClaimExpenseTypeController::handle` |
| `orangehrmClaimPlugin` | `claim_save_claim_expense_types` | `GET` | `/claim/saveExpense` | `OrangeHRM\Claim\Controller\SaveClaimExpenseTypeController::handle` |
| `orangehrmClaimPlugin` | `claim_edit_claim_expense_types` | `GET` | `/claim/saveExpense/{id}` | `OrangeHRM\Claim\Controller\SaveClaimExpenseTypeController::handle` |
| `orangehrmClaimPlugin` | `claim_submit_claim` | `GET` | `/claim/submitClaim` | `OrangeHRM\Claim\Controller\SubmitClaimController::handle` |
| `orangehrmClaimPlugin` | `claim_submit_claim_request` | `GET` | `/claim/submitClaim/id/{id}` | `OrangeHRM\Claim\Controller\SubmitClaimRequestController::handle` |
| `orangehrmClaimPlugin` | `claim_view_claim` | `GET` | `/claim/viewClaim` | `OrangeHRM\Claim\Controller\ViewMyClaimController::handle` |
| `orangehrmClaimPlugin` | `claim_assign_claim` | `GET` | `/claim/assignClaim` | `OrangeHRM\Claim\Controller\AssignClaimController::handle` |
| `orangehrmClaimPlugin` | `claim_assign_claim_request` | `GET` | `/claim/assignClaim/id/{id}` | `OrangeHRM\Claim\Controller\AssignClaimRequestController::handle` |
| `orangehrmClaimPlugin` | `claim_employee_claim` | `GET` | `/claim/viewAssignClaim` | `OrangeHRM\Claim\Controller\ViewAssignClaimController::handle` |
| `orangehrmClaimPlugin` | `claim_attachment` | `GET` | `/claim/requests/{requestId}/attachId/{attachId}` | `OrangeHRM\Claim\Controller\ClaimAttachmentController::handle` |
| `orangehrmCoreOAuthPlugin` | `apiv2_admin_oauth_client` | `GET, PUT` | `/api/v2/admin/oauth-clients/{id}` | `OrangeHRM\OAuth\Api\OAuthClientAPI` |
| `orangehrmCoreOAuthPlugin` | `apiv2_admin_oauth_clients` | `GET, POST, DELETE` | `/api/v2/admin/oauth-clients` | `OrangeHRM\OAuth\Api\OAuthClientAPI` |
| `orangehrmCoreOAuthPlugin` | `admin_view_oauth_client` | `GET` | `/admin/registerOAuthClient` | `OrangeHRM\OAuth\Controller\OAuthClientController::handle` |
| `orangehrmCoreOAuthPlugin` | `admin_edit_oauth_client` | `GET` | `/admin/editOAuthClient` | `OrangeHRM\OAuth\Controller\SaveOAuthClientController::handle` |
| `orangehrmCoreOAuthPlugin` | `admin_save_oauth_client` | `GET` | `/admin/saveOAuthClient` | `OrangeHRM\OAuth\Controller\SaveOAuthClientController::handle` |
| `orangehrmCoreOAuthPlugin` | `auth_oauth2_consent` | `GET` | `/oauth2/authorize/consent` | `OrangeHRM\OAuth\Controller\OAuth2\AuthorizationController::handle` |
| `orangehrmCoreOAuthPlugin` | `auth_oauth2_authorize` | `GET` | `/oauth2/authorize` | `OrangeHRM\OAuth\Controller\AuthorizationController::handle` |
| `orangehrmCoreOAuthPlugin` | `auth_oauth2_token` | `POST` | `/oauth2/token` | `OrangeHRM\OAuth\Controller\OAuth2\TokenController::handle` |
| `orangehrmCorePlugin` | `apiv2_core_data_groups` | `GET, POST, DELETE` | `/api/v2/core/data-groups` | `OrangeHRM\Core\Api\Rest\DataGroupAPI` |
| `orangehrmCorePlugin` | `apiv2_core_about_organization` | `GET` | `/api/v2/core/about` | `OrangeHRM\Core\Api\Rest\AboutOrganizationAPI` |
| `orangehrmCorePlugin` | `push_events` | `POST` | `/events/push` | `OrangeHRM\Core\Registration\Controller\PushEventController::handle` |
| `orangehrmCorePlugin` | `apiv2_core_public_api_version` | `GET` | `/api/v2/core/public/version` | `OrangeHRM\Core\PublicApi\VersionAPI` |
| `orangehrmCorePlugin` | `apiv2_core_validate_uniqueness` | `GET` | `/api/v2/core/validation/unique` | `OrangeHRM\Core\Api\Rest\ValidationUniqueAPI` |
| `orangehrmCorporateBrandingPlugin` | `apiv2_corporate_branding_theme` | `GET, PUT, DELETE` | `/api/v2/admin/theme` | `OrangeHRM\CorporateBranding\Api\ThemeAPI` |
| `orangehrmCorporateBrandingPlugin` | `apiv2_corporate_branding_theme_preview` | `POST` | `/api/v2/admin/theme/preview` | `OrangeHRM\CorporateBranding\Api\PreviewThemeAPI` |
| `orangehrmCorporateBrandingPlugin` | `corporate_branding_images` | `GET` | `/admin/theme/image/{imageName}` | `OrangeHRM\CorporateBranding\Controller\File\ImageController::handle` |
| `orangehrmCorporateBrandingPlugin` | `corporate_branding_attachments_image` | `GET` | `/admin/theme/attachments/image/{imageName}` | `OrangeHRM\CorporateBranding\Controller\File\ImageAttachmentController::handle` |
| `orangehrmCorporateBrandingPlugin` | `admin_corporate_branding` | `GET` | `/admin/addTheme` | `OrangeHRM\CorporateBranding\Controller\CorporateBrandingController::handle` |
| `orangehrmCorporateDirectoryPlugin` | `apiv2_corporate_directory_employee` | `GET` | `/api/v2/directory/employees/{empNumber}` | `OrangeHRM\CorporateDirectory\Api\EmployeeDirectoryAPI` |
| `orangehrmCorporateDirectoryPlugin` | `apiv2_corporate_directory_employees` | `GET` | `/api/v2/directory/employees` | `OrangeHRM\CorporateDirectory\Api\EmployeeDirectoryAPI` |
| `orangehrmCorporateDirectoryPlugin` | `corporate_directory_module` | `GET` | `/directory/viewDirectory` | `OrangeHRM\CorporateDirectory\Controller\CorporateDirectoryModuleController::handle` |
| `orangehrmDashboardPlugin` | `apiv2_dashboard_employees_on_leave` | `GET` | `/api/v2/dashboard/employees/leaves` | `OrangeHRM\Dashboard\Api\EmployeeOnLeaveAPI` |
| `orangehrmDashboardPlugin` | `apiv2_dashboard_employees_by_subunit` | `GET` | `/api/v2/dashboard/employees/subunit` | `OrangeHRM\Dashboard\Api\EmployeeDistributionBySubunitAPI` |
| `orangehrmDashboardPlugin` | `apiv2_dashboard_quick_launch` | `GET` | `/api/v2/dashboard/shortcuts` | `OrangeHRM\Dashboard\Api\QuickLaunchAPI` |
| `orangehrmDashboardPlugin` | `apiv2_dashboard_employees_by_location` | `GET` | `/api/v2/dashboard/employees/locations` | `OrangeHRM\Dashboard\Api\EmployeeDistributionByLocationAPI` |
| `orangehrmDashboardPlugin` | `apiv2_dashboard_employee_time_at_work` | `GET` | `/api/v2/dashboard/employees/time-at-work` | `OrangeHRM\Dashboard\Api\EmployeeTimeAtWorkAPI` |
| `orangehrmDashboardPlugin` | `apiv2_dashboard_employee_action_summary` | `GET` | `/api/v2/dashboard/employees/action-summary` | `OrangeHRM\Dashboard\Api\EmployeeActionSummaryAPI` |
| `orangehrmDashboardPlugin` | `apiv2_dashboard_employee_on_leave_today_configuration` | `GET, PUT` | `/api/v2/dashboard/config/employee-on-leave-today` | `OrangeHRM\Dashboard\Api\EmployeeOnLeaveTodayConfigAPI` |
| `orangehrmDashboardPlugin` | `dashboard_widget` | `GET` | `/dashboard/index` | `OrangeHRM\Dashboard\Controller\DashboardController::handle` |
| `orangehrmHelpPlugin` | `view_help_support` | `GET` | `/help/support` | `OrangeHRM\Help\Controller\ViewSupportController::handle` |
| `orangehrmHelpPlugin` | `help_help` | `GET` | `/help/help` | `OrangeHRM\Help\Controller\HelpController::handle` |
| `orangehrmI18NPlugin` | `core_i18n_messages` | `GET` | `/core/i18n/messages` | `OrangeHRM\I18N\Controller\I18NMessagesController::handle` |
| `orangehrmLDAPAuthenticationPlugin` | `apiv2_admin_ldap_configuration` | `GET, PUT` | `/api/v2/admin/ldap-config` | `OrangeHRM\LDAP\Api\LDAPConfigAPI` |
| `orangehrmLDAPAuthenticationPlugin` | `apiv2_admin_ldap_test_connection` | `POST` | `/api/v2/admin/ldap-test-connection` | `OrangeHRM\LDAP\Api\LDAPTestConnectionAPI` |
| `orangehrmLDAPAuthenticationPlugin` | `apiv2_admin_ldap_user_sync` | `GET, POST` | `/api/v2/admin/ldap/user-sync` | `OrangeHRM\LDAP\Api\LDAPUserSyncAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_holiday` | `GET, PUT` | `/api/v2/leave/holidays/{id}` | `OrangeHRM\Leave\Api\HolidayAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_holidays` | `GET, POST, DELETE` | `/api/v2/leave/holidays` | `OrangeHRM\Leave\Api\HolidayAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_workweek` | `GET, PUT` | `/api/v2/leave/workweek` | `OrangeHRM\Leave\Api\WorkWeekAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_leave_period` | `GET, PUT` | `/api/v2/leave/leave-period` | `OrangeHRM\Leave\Api\LeavePeriodAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_leave_periods` | `GET` | `/api/v2/leave/leave-periods` | `OrangeHRM\Leave\Api\LeavePeriodAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_leave_type` | `GET, PUT` | `/api/v2/leave/leave-types/{id}` | `OrangeHRM\Leave\Api\LeaveTypeAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_leave_types` | `GET, POST, DELETE` | `/api/v2/leave/leave-types` | `OrangeHRM\Leave\Api\LeaveTypeAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_eligible_leave_types` | `GET, POST, DELETE` | `/api/v2/leave/leave-types/eligible` | `OrangeHRM\Leave\Api\EligibleLeaveTypeAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_my_leave_requests` | `GET, POST, DELETE` | `/api/v2/leave/leave-requests` | `OrangeHRM\Leave\Api\MyLeaveRequestAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_my_leave_request` | `GET, PUT` | `/api/v2/leave/leave-requests/{leaveRequestId}` | `OrangeHRM\Leave\Api\MyLeaveRequestAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_employee_leave_requests` | `GET, POST, DELETE` | `/api/v2/leave/employees/leave-requests` | `OrangeHRM\Leave\Api\EmployeeLeaveRequestAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_employee_leave_request` | `GET, PUT` | `/api/v2/leave/employees/leave-requests/{leaveRequestId}` | `OrangeHRM\Leave\Api\EmployeeLeaveRequestAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_employees_bulk_leave_request` | `PUT` | `/api/v2/leave/employees/leave-requests/bulk` | `OrangeHRM\Leave\Api\EmployeeBulkLeaveRequestAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_leave_entitlement` | `GET, PUT` | `/api/v2/leave/leave-entitlements/{id}` | `OrangeHRM\Leave\Api\LeaveEntitlementAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_leave_entitlements` | `GET, POST, DELETE` | `/api/v2/leave/leave-entitlements` | `OrangeHRM\Leave\Api\LeaveEntitlementAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_employee_leave_entitlements` | `GET` | `/api/v2/leave/employees/{empNumber}/leave-entitlements` | `OrangeHRM\Leave\Api\EmployeeLeaveEntitlementAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_employees_leave_entitlements` | `GET` | `/api/v2/leave/employees/leave-entitlements` | `OrangeHRM\Leave\Api\EmployeeLeaveEntitlementAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_leave_balance` | `GET` | `/api/v2/leave/leave-balance/leave-type/{leaveTypeId}` | `OrangeHRM\Leave\Api\LeaveBalanceAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_employee_leave_balances` | `GET` | `/api/v2/leave/employees/leave-balances` | `OrangeHRM\Leave\Api\EmployeeLeaveBalanceAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_leave_entitlements_validation_value` | `GET` | `/api/v2/leave/leave-entitlements/{id}/validation/entitlements` | `OrangeHRM\Leave\Api\ValidationLeaveEntitlementValueAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_overlap_leaves` | `GET` | `/api/v2/leave/overlap-leaves` | `OrangeHRM\Leave\Api\LeaveOverlapAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_request_comments` | `GET, POST` | `/api/v2/leave/leave-requests/{leaveRequestId}/leave-comments` | `OrangeHRM\Leave\Api\LeaveRequestCommentAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_comments` | `GET, POST` | `/api/v2/leave/leaves/{leaveId}/leave-comments` | `OrangeHRM\Leave\Api\LeaveCommentAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_leaves` | `GET` | `/api/v2/leave/leave-requests/{leaveRequestId}/leaves` | `OrangeHRM\Leave\Api\LeaveAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_leave` | `PUT` | `/api/v2/leave/leaves/{leaveId}` | `OrangeHRM\Leave\Api\LeaveAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_bulk_leaves` | `PUT` | `/api/v2/leave/leaves/bulk` | `OrangeHRM\Leave\Api\BulkLeaveAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_reports` | `GET` | `/api/v2/leave/reports` | `OrangeHRM\Leave\Api\LeaveReportAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_reports_data` | `GET` | `/api/v2/leave/reports/data` | `OrangeHRM\Leave\Api\LeaveReportDataAPI` |
| `orangehrmLeavePlugin` | `apiv2_leave_employee_leave` | `GET` | `/api/v2/leave/employees/leaves` | `OrangeHRM\Leave\Api\EmployeeLeaveAPI` |
| `orangehrmLeavePlugin` | `leave_module` | `GET` | `/leave/viewLeaveModule` | `OrangeHRM\Leave\Controller\LeaveModuleController::handle` |
| `orangehrmLeavePlugin` | `leave_define_leave_period` | `GET` | `/leave/defineLeavePeriod` | `OrangeHRM\Leave\Controller\LeavePeriodController::handle` |
| `orangehrmLeavePlugin` | `leave_apply_leave` | `GET` | `/leave/applyLeave` | `OrangeHRM\Leave\Controller\ApplyLeaveController::handle` |
| `orangehrmLeavePlugin` | `leave_assign_leave` | `GET` | `/leave/assignLeave` | `OrangeHRM\Leave\Controller\AssignLeaveController::handle` |
| `orangehrmLeavePlugin` | `leave_leave_list` | `GET` | `/leave/viewLeaveList` | `OrangeHRM\Leave\Controller\LeaveListController::handle` |
| `orangehrmLeavePlugin` | `leave_my_leave_list` | `GET` | `/leave/viewMyLeaveList` | `OrangeHRM\Leave\Controller\MyLeaveListController::handle` |
| `orangehrmLeavePlugin` | `leave_view_leave_request` | `GET` | `/leave/viewLeaveRequest/{id}` | `OrangeHRM\Leave\Controller\LeaveRequestController::handle` |
| `orangehrmLeavePlugin` | `view_leave_type` | `GET` | `/leave/leaveTypeList` | `OrangeHRM\Leave\Controller\LeaveTypeController::handle` |
| `orangehrmLeavePlugin` | `save_leave_type` | `GET` | `/leave/defineLeaveType` | `OrangeHRM\Leave\Controller\SaveLeaveTypeController::handle` |
| `orangehrmLeavePlugin` | `edit_leave_type` | `GET` | `/leave/defineLeaveType/{id}` | `OrangeHRM\Leave\Controller\SaveLeaveTypeController::handle` |
| `orangehrmLeavePlugin` | `leave_add_leave_entitlement` | `GET` | `/leave/addLeaveEntitlement` | `OrangeHRM\Leave\Controller\SaveLeaveEntitlementController::handle` |
| `orangehrmLeavePlugin` | `leave_edit_leave_entitlement` | `GET` | `/leave/editLeaveEntitlement/{id}` | `OrangeHRM\Leave\Controller\SaveLeaveEntitlementController::handle` |
| `orangehrmLeavePlugin` | `leave_view_leave_entitlement` | `GET` | `/leave/viewLeaveEntitlements` | `OrangeHRM\Leave\Controller\ViewLeaveEntitlementController::handle` |
| `orangehrmLeavePlugin` | `leave_view_my_leave_entitlement` | `GET` | `/leave/viewMyLeaveEntitlements` | `OrangeHRM\Leave\Controller\ViewMyLeaveEntitlementController::handle` |
| `orangehrmLeavePlugin` | `leave_work_week` | `GET` | `/leave/defineWorkWeek` | `OrangeHRM\Leave\Controller\WorkWeekController::handle` |
| `orangehrmLeavePlugin` | `list_holidays` | `GET` | `/leave/viewHolidayList` | `OrangeHRM\Leave\Controller\HolidayController::handle` |
| `orangehrmLeavePlugin` | `add_holiday` | `GET` | `/leave/saveHolidays` | `OrangeHRM\Leave\Controller\SaveHolidayController::handle` |
| `orangehrmLeavePlugin` | `edit_holiday` | `GET` | `/leave/saveHolidays/{id}` | `OrangeHRM\Leave\Controller\SaveHolidayController::handle` |
| `orangehrmLeavePlugin` | `leave_view_leave_entitlement_report` | `GET` | `/leave/viewLeaveBalanceReport` | `OrangeHRM\Leave\Controller\LeaveEntitlementReport::handle` |
| `orangehrmLeavePlugin` | `leave_view_my_leave_entitlement_report` | `GET` | `/leave/viewMyLeaveBalanceReport` | `OrangeHRM\Leave\Controller\MyLeaveEntitlementReport::handle` |
| `orangehrmMaintenancePlugin` | `apiv2_maintenance_purge` | `DELETE` | `/api/v2/maintenance/purge` | `OrangeHRM\Maintenance\Api\PurgeEmployeeAPI` |
| `orangehrmMaintenancePlugin` | `apiv2_maintenance_purge_candidate` | `DELETE` | `/api/v2/maintenance/candidates/purge` | `OrangeHRM\Maintenance\Api\PurgeCandidateAPI` |
| `orangehrmMaintenancePlugin` | `apiv2_maintenance_candidates` | `GET` | `/api/v2/maintenance/candidates` | `OrangeHRM\Maintenance\Api\PurgeCandidateAPI` |
| `orangehrmMaintenancePlugin` | `maintainence_employee_json` | `GET` | `/maintenance/accessEmployeeData/{empNumber}` | `OrangeHRM\Maintenance\Controller\File\AccessEmployeeFileController::handle` |
| `orangehrmMaintenancePlugin` | `maintainence_module` | `GET` | `/maintenance/viewMaintenanceModule` | `OrangeHRM\Maintenance\Controller\MaintenanceModuleController::handle` |
| `orangehrmMaintenancePlugin` | `maintainence_access_employee_screen` | `GET` | `/maintenance/accessEmployeeData` | `OrangeHRM\Maintenance\Controller\AccessEmployeeController::handle` |
| `orangehrmMaintenancePlugin` | `maintainence_purge_employee` | `GET` | `/maintenance/purgeEmployee` | `OrangeHRM\Maintenance\Controller\PurgeEmployeeController::handle` |
| `orangehrmMaintenancePlugin` | `maintainence_candidate_records` | `GET` | `/maintenance/purgeCandidateData` | `OrangeHRM\Maintenance\Controller\PurgeCandidateController::handle` |
| `orangehrmMobilePlugin` | `apiv2_mobile_modules` | `GET` | `/api/v2/mobile/menus` | `OrangeHRM\Mobile\Api\MenuItemAPI` |
| `orangehrmOpenidAuthenticationPlugin` | `apiv2_auth_openid_providers` | `POST, GET, DELETE` | `/api/v2/auth/openid-providers` | `OrangeHRM\OpenidAuthentication\Api\ProviderAPI` |
| `orangehrmOpenidAuthenticationPlugin` | `apiv2_auth_openid_provider` | `GET, PUT` | `/api/v2/auth/openid-providers/{id}` | `OrangeHRM\OpenidAuthentication\Api\ProviderAPI` |
| `orangehrmOpenidAuthenticationPlugin` | `admin_add_auth_provider` | `GET` | `admin/addAuthProvider` | `OrangeHRM\OpenidAuthentication\Controller\SaveSocialMediaAuthProviderController::handle` |
| `orangehrmOpenidAuthenticationPlugin` | `admin_edit_auth_provider` | `GET` | `admin/editAuthProvider/{id}` | `OrangeHRM\OpenidAuthentication\Controller\EditSocialMediaAuthProviderController::handle` |
| `orangehrmOpenidAuthenticationPlugin` | `auth_oidc_login_redirect` | `GET` | `/openidauth/openIdCredentials` | `OrangeHRM\OpenidAuthentication\Controller\OpenIdConnectRedirectController::handle` |
| `orangehrmOpenidAuthenticationPlugin` | `auth_oidc_login` | `GET` | `/openidauth/openIdCredentials/{providerId}` | `OrangeHRM\OpenidAuthentication\Controller\OpenIdConnectLoginController::handle` |
| `orangehrmPerformancePlugin` | `apiv2_performance_kpi` | `GET, PUT` | `/api/v2/performance/kpis/{id}` | `OrangeHRM\Performance\Api\KpiAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_kpis` | `GET, POST, DELETE` | `/api/v2/performance/kpis` | `OrangeHRM\Performance\Api\KpiAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_supervisors` | `GET, POST, DELETE` | `/api/v2/performance/supervisors` | `OrangeHRM\Performance\Api\ReviewEmployeeSupervisorAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_review` | `GET, PUT` | `/api/v2/performance/manage/reviews/{id}` | `OrangeHRM\Performance\Api\PerformanceReviewAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_reviews` | `GET, POST, DELETE` | `/api/v2/performance/manage/reviews` | `OrangeHRM\Performance\Api\PerformanceReviewAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_config_trackers` | `GET, POST, DELETE` | `/api/v2/performance/config/trackers` | `OrangeHRM\Performance\Api\PerformanceTrackerAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_config_tracker` | `GET, PUT` | `/api/v2/performance/config/trackers/{id}` | `OrangeHRM\Performance\Api\PerformanceTrackerAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_reviewers` | `GET` | `/api/v2/performance/trackers/reviewers` | `OrangeHRM\Performance\Api\PerformanceTrackerReviewerAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_my_trackers` | `GET` | `/api/v2/performance/trackers` | `OrangeHRM\Performance\Api\MyTrackerAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_my_reviews` | `GET` | `/api/v2/performance/reviews` | `OrangeHRM\Performance\Api\MyReviewAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_employee_trackers` | `GET` | `/api/v2/performance/employees/trackers` | `OrangeHRM\Performance\Api\EmployeeTrackerAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_review_list` | `GET` | `/api/v2/performance/employees/reviews` | `OrangeHRM\Performance\Api\ReviewListAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_review_allowed_actions` | `GET` | `/api/v2/performance/reviews/{reviewId}/actions/allowed` | `OrangeHRM\Performance\Api\PerformanceReviewAllowedActionsAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_employee_tracker` | `GET` | `/api/v2/performance/employees/trackers/{id}` | `OrangeHRM\Performance\Api\EmployeeTrackerAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_tracker_logs` | `GET, POST, DELETE` | `/api/v2/performance/trackers/{trackerId}/logs` | `OrangeHRM\Performance\Api\PerformanceTrackerLogAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_tracker_log` | `GET, PUT` | `api/v2/performance/trackers/{trackerId}/logs/{id}` | `OrangeHRM\Performance\Api\PerformanceTrackerLogAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_reviews_kpis` | `GET` | `/api/v2/performance/reviews/{reviewId}/kpis` | `OrangeHRM\Performance\Api\ReviewKpiAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_reviews_supervisor_evaluation` | `GET, PUT` | `/api/v2/performance/reviews/{reviewId}/evaluation/supervisor` | `OrangeHRM\Performance\Api\SupervisorEvaluationAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_reviews_employee_evaluation` | `GET, PUT` | `/api/v2/performance/reviews/{reviewId}/evaluation/employee` | `OrangeHRM\Performance\Api\EmployeeEvaluationAPI` |
| `orangehrmPerformancePlugin` | `apiv2_performance_reviews_final_evaluation` | `GET, PUT` | `/api/v2/performance/reviews/{reviewId}/evaluation/final` | `OrangeHRM\Performance\Api\PerformanceReviewFinalEvaluationAPI` |
| `orangehrmPerformancePlugin` | `performance_module` | `GET` | `/performance/viewPerformanceModule` | `OrangeHRM\Performance\Controller\PerformanceModuleController::handle` |
| `orangehrmPerformancePlugin` | `performance_my_trackers` | `GET` | `/performance/viewMyPerformanceTrackerList` | `OrangeHRM\Performance\Controller\MyTrackerController::handle` |
| `orangehrmPerformancePlugin` | `performance_employee_tracker` | `GET` | `/performance/viewEmployeePerformanceTrackerList` | `OrangeHRM\Performance\Controller\EmployeeTrackerController::handle` |
| `orangehrmPerformancePlugin` | `performance_kpi_search` | `GET` | `/performance/searchKpi` | `OrangeHRM\Performance\Controller\KpiSearchController::handle` |
| `orangehrmPerformancePlugin` | `performance_kpi_save` | `GET` | `/performance/saveKpi` | `OrangeHRM\Performance\Controller\KpiSaveController::handle` |
| `orangehrmPerformancePlugin` | `performance_kpi_edit` | `GET` | `/performance/saveKpi/{id}` | `OrangeHRM\Performance\Controller\KpiSaveController::handle` |
| `orangehrmPerformancePlugin` | `performance_review_save` | `GET` | `/performance/saveReview` | `OrangeHRM\Performance\Controller\PerformanceReviewSaveController::handle` |
| `orangehrmPerformancePlugin` | `performance_review_edit` | `GET` | `/performance/saveReview/{id}` | `OrangeHRM\Performance\Controller\PerformanceReviewSaveController::handle` |
| `orangehrmPerformancePlugin` | `performance_tracker_list` | `GET` | `/performance/viewPerformanceTracker` | `OrangeHRM\Performance\Controller\TrackerListController::handle` |
| `orangehrmPerformancePlugin` | `performance_add_tracker` | `GET` | `/performance/addPerformanceTracker` | `OrangeHRM\Performance\Controller\SavePerformanceTrackerController::handle` |
| `orangehrmPerformancePlugin` | `performance_edit_tracker` | `GET` | `/performance/addPerformanceTracker/{id}` | `OrangeHRM\Performance\Controller\SavePerformanceTrackerController::handle` |
| `orangehrmPerformancePlugin` | `performance_my_reviews` | `GET` | `/performance/myPerformanceReview` | `OrangeHRM\Performance\Controller\MyReviewController::handle` |
| `orangehrmPerformancePlugin` | `performance_review_list` | `GET` | `/performance/searchEvaluatePerformanceReview` | `OrangeHRM\Performance\Controller\ReviewListController::handle` |
| `orangehrmPerformancePlugin` | `performance_review_search` | `GET` | `/performance/searchPerformanceReview` | `OrangeHRM\Performance\Controller\ReviewSearchController::handle` |
| `orangehrmPerformancePlugin` | `performance_employee_tracker_logs` | `GET` | `/performance/addPerformanceTrackerLog/trackId/{id}` | `OrangeHRM\Performance\Controller\EmployeeTrackerLogsController::handle` |
| `orangehrmPerformancePlugin` | `performance_employee_admin_evaluation` | `GET` | `/performance/reviewEvaluateByAdmin/{id}` | `OrangeHRM\Performance\Controller\AdminEvaluationController::handle` |
| `orangehrmPerformancePlugin` | `performance_review_evaluate_self` | `GET` | `/performance/reviewEvaluate/id/{id}` | `OrangeHRM\Performance\Controller\SelfEvaluationController::handle` |
| `orangehrmPimPlugin` | `apiv2_pim_employee` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}` | `OrangeHRM\Pim\Api\EmployeeAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees` | `GET, POST, DELETE` | `/api/v2/pim/employees` | `OrangeHRM\Pim\Api\EmployeeAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_count` | `GET` | `/api/v2/pim/employees/count` | `OrangeHRM\Pim\Api\EmployeeCountAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employee_picture` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/picture` | `OrangeHRM\Pim\Api\EmployeePictureAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employee_custom_fields` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/custom-fields` | `OrangeHRM\Pim\Api\EmployeeCustomFieldAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_personal_details` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/personal-details` | `OrangeHRM\Pim\Api\EmployeePersonalDetailAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_job_details` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/job-details` | `OrangeHRM\Pim\Api\EmployeeJobDetailAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_job_employment_contract` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/employment-contract` | `OrangeHRM\Pim\Api\EmploymentContractAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_termination` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/terminations/{id}` | `OrangeHRM\Pim\Api\EmployeeTerminationAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_terminations` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/terminations` | `OrangeHRM\Pim\Api\EmployeeTerminationAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employee_contact_details` | `GET, PUT` | `/api/v2/pim/employee/{empNumber}/contact-details` | `OrangeHRM\Pim\Api\EmployeeContactDetailsAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_dependent` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/dependents/{id}` | `OrangeHRM\Pim\Api\EmployeeDependentAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_dependents` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/dependents` | `OrangeHRM\Pim\Api\EmployeeDependentAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_salary_component` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/salary-components/{id}` | `OrangeHRM\Pim\Api\EmployeeSalaryComponentAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_salary_components` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/salary-components` | `OrangeHRM\Pim\Api\EmployeeSalaryComponentAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_attachment` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/screen/{screen}/attachments/{id}` | `OrangeHRM\Pim\Api\EmployeeAttachmentAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_attachments` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/screen/{screen}/attachments` | `OrangeHRM\Pim\Api\EmployeeAttachmentAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employee_emergency_contact` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/emergency-contacts/{id}` | `OrangeHRM\Pim\Api\EmpEmergencyContactAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employee_emergency_contacts` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/emergency-contacts` | `OrangeHRM\Pim\Api\EmpEmergencyContactAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_skills` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/skills` | `OrangeHRM\Pim\Api\EmployeeSkillAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_allowed_skills` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/skills/allowed` | `OrangeHRM\Pim\Api\EmployeeAllowedSkillAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_skill` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/skills/{id}` | `OrangeHRM\Pim\Api\EmployeeSkillAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_educations` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/educations` | `OrangeHRM\Pim\Api\EmployeeEducationAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_education` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/educations/{id}` | `OrangeHRM\Pim\Api\EmployeeEducationAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_languages` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/languages` | `OrangeHRM\Pim\Api\EmployeeLanguageAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_language` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/languages/{languageId}/fluencies/{fluencyId}` | `OrangeHRM\Pim\Api\EmployeeLanguageAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_allowed_languages` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/languages/allowed` | `OrangeHRM\Pim\Api\EmployeeAllowedLanguageAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_work_experiences` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/work-experiences` | `OrangeHRM\Pim\Api\EmployeeWorkExperienceAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_work_experience` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/work-experiences/{id}` | `OrangeHRM\Pim\Api\EmployeeWorkExperienceAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_licenses` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/licenses` | `OrangeHRM\Pim\Api\EmployeeLicenseAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_allowed_licenses` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/licenses/allowed` | `OrangeHRM\Pim\Api\EmployeeAllowedLicenseAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_license` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/licenses/{id}` | `OrangeHRM\Pim\Api\EmployeeLicenseAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_termination_reason` | `GET, PUT` | `/api/v2/pim/termination-reasons/{id}` | `OrangeHRM\Pim\Api\TerminationReasonConfigurationAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_termination_reasons` | `GET, POST, DELETE` | `/api/v2/pim/termination-reasons` | `OrangeHRM\Pim\Api\TerminationReasonConfigurationAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_reporting_method` | `GET, PUT` | `/api/v2/pim/reporting-methods/{id}` | `OrangeHRM\Pim\Api\ReportingMethodConfigurationAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_reporting_methods` | `GET, POST, DELETE` | `/api/v2/pim/reporting-methods` | `OrangeHRM\Pim\Api\ReportingMethodConfigurationAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_custom_fields` | `GET, POST, DELETE` | `/api/v2/pim/custom-fields` | `OrangeHRM\Pim\Api\CustomFieldAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_custom_field` | `GET, PUT` | `/api/v2/pim/custom-fields/{id}` | `OrangeHRM\Pim\Api\CustomFieldAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_optional_field` | `GET, PUT` | `/api/v2/pim/optional-field` | `OrangeHRM\Pim\Api\OptionalFieldAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_immigration` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/immigrations/{id}` | `OrangeHRM\Pim\Api\EmployeeImmigrationRecordAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_immigrations` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/immigrations` | `OrangeHRM\Pim\Api\EmployeeImmigrationRecordAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_report_to_supervisors` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/supervisors` | `OrangeHRM\Pim\Api\EmployeeSupervisorAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_report_to_supervisor` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/supervisors/{id}` | `OrangeHRM\Pim\Api\EmployeeSupervisorAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_report_to_subordinate` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/subordinates/{id}` | `OrangeHRM\Pim\Api\EmployeeSubordinateAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_report_to_subordinates` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/subordinates` | `OrangeHRM\Pim\Api\EmployeeSubordinateAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_report_to_allowed_employees` | `GET` | `/api/v2/pim/employees/{empNumber}/report-to/allowed` | `OrangeHRM\Pim\Api\EmployeeAllowedReportToEmployeeAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_memberships` | `GET, POST, DELETE` | `/api/v2/pim/employees/{empNumber}/memberships` | `OrangeHRM\Pim\Api\EmployeeMembershipAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_membership` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/memberships/{id}` | `OrangeHRM\Pim\Api\EmployeeMembershipAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_us_tax_exemption` | `GET, PUT` | `/api/v2/pim/employees/{empNumber}/tax-exemption` | `OrangeHRM\Pim\Api\EmpUsTaxExemptionAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_work_shift` | `GET` | `/api/v2/pim/employees/{empNumber}/work-shift` | `OrangeHRM\Pim\Api\EmployeeWorkShiftAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_employees_import` | `POST` | `/api/v2/pim/csv-import` | `OrangeHRM\Pim\Api\EmployeeCSVImportAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_reports` | `GET` | `/api/v2/pim/reports` | `OrangeHRM\Pim\Api\PimReportAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_reports_data` | `GET` | `/api/v2/pim/reports/data` | `OrangeHRM\Pim\Api\PimReportDataAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_defined_reports` | `GET, POST, DELETE` | `/api/v2/pim/reports/defined` | `OrangeHRM\Pim\Api\PimDefinedReportAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_defined_report` | `GET, PUT` | `/api/v2/pim/reports/defined/{id}` | `OrangeHRM\Pim\Api\PimDefinedReportAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_update_password` | `PUT` | `/api/v2/pim/update-password` | `OrangeHRM\Pim\Api\UpdatePasswordAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_validate_employee_email` | `GET` | `/api/v2/pim/employees/{empNumber}/contact-details/validation/work-emails` | `OrangeHRM\Pim\Api\ValidationEmployeeEmailAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_validate_employee_other_email` | `GET` | `/api/v2/pim/employees/{empNumber}/contact-details/validation/other-emails` | `OrangeHRM\Pim\Api\ValidationEmployeeOtherEmailAPI` |
| `orangehrmPimPlugin` | `apiv2_pim_my_info` | `GET` | `/api/v2/pim/myself` | `OrangeHRM\Pim\Api\MyInfoAPI` |
| `orangehrmPimPlugin` | `pim_employee_picture` | `GET` | `/pim/viewPhoto/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\File\EmployeePictureController::handle` |
| `orangehrmPimPlugin` | `pim_employee_attachment` | `GET` | `/pim/viewAttachment/empNumber/{empNumber}/attachId/{attachId}` | `OrangeHRM\Pim\Controller\File\EmployeeAttachmentController::handle` |
| `orangehrmPimPlugin` | `pim_employee_csv_import_sample_attachment` | `GET` | `/pim/sampleCsvDownload` | `OrangeHRM\Pim\Controller\File\EmployeeCsvImportSampleAttachmentController::handle` |
| `orangehrmPimPlugin` | `pim_module` | `GET` | `/pim/viewPimModule` | `OrangeHRM\Pim\Controller\PimModuleController::handle` |
| `orangehrmPimPlugin` | `pim_view_my_details` | `GET` | `/pim/viewMyDetails` | `OrangeHRM\Pim\Controller\ViewMyDetailsController::handle` |
| `orangehrmPimPlugin` | `pim_view_employee_list` | `GET` | `/pim/viewEmployeeList` | `OrangeHRM\Pim\Controller\EmployeeController::handle` |
| `orangehrmPimPlugin` | `pim_add_employee` | `GET` | `/pim/addEmployee` | `OrangeHRM\Pim\Controller\SaveEmployeeController::handle` |
| `orangehrmPimPlugin` | `pim_employee_personal_details` | `GET` | `/pim/viewPersonalDetails/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\EmployeePersonalDetailController::handle` |
| `orangehrmPimPlugin` | `pim_employee_contact_details` | `GET` | `/pim/contactDetails/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\EmployeeContactDetailsController::handle` |
| `orangehrmPimPlugin` | `pim_employee_emergency_contacts` | `GET` | `/pim/viewEmergencyContacts/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\EmployeeEmergencyContactsController::handle` |
| `orangehrmPimPlugin` | `pim_employee_dependents` | `GET` | `/pim/viewDependents/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\EmployeeDependentsController::handle` |
| `orangehrmPimPlugin` | `pim_employee_salary` | `GET` | `/pim/viewSalaryList/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\EmployeeSalaryController::handle` |
| `orangehrmPimPlugin` | `pim_employee_profile_picture` | `GET` | `/pim/viewPhotograph/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\EmployeeProfilePictureController::handle` |
| `orangehrmPimPlugin` | `pim_employee_job` | `GET` | `/pim/viewJobDetails/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\EmployeeJobController::handle` |
| `orangehrmPimPlugin` | `pim_employee_qualifications` | `GET` | `/pim/viewQualifications/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\EmployeeQualificationsController::handle` |
| `orangehrmPimPlugin` | `pim_employee_report_to` | `GET` | `/pim/viewReportToDetails/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\EmployeeReportToController::handle` |
| `orangehrmPimPlugin` | `view_termination_reason` | `GET` | `/pim/viewTerminationReasons` | `OrangeHRM\Pim\Controller\TerminationReasonController::handle` |
| `orangehrmPimPlugin` | `save_termination_reason` | `GET` | `/pim/saveTerminationReasons` | `OrangeHRM\Pim\Controller\SaveTerminationReasonController::handle` |
| `orangehrmPimPlugin` | `edit_termination_reason` | `GET` | `/pim/saveTerminationReasons/{id}` | `OrangeHRM\Pim\Controller\SaveTerminationReasonController::handle` |
| `orangehrmPimPlugin` | `view_reporting_method` | `GET` | `/pim/viewReportingMethods` | `OrangeHRM\Pim\Controller\ReportingMethodController::handle` |
| `orangehrmPimPlugin` | `save_reporting_method` | `GET` | `/pim/saveReportingMethod` | `OrangeHRM\Pim\Controller\SaveReportingMethodController::handle` |
| `orangehrmPimPlugin` | `edit_reporting_method` | `GET` | `/pim/saveReportingMethod/{id}` | `OrangeHRM\Pim\Controller\SaveReportingMethodController::handle` |
| `orangehrmPimPlugin` | `view_custom_fields` | `GET` | `/pim/listCustomFields` | `OrangeHRM\Pim\Controller\CustomFieldController::handle` |
| `orangehrmPimPlugin` | `save_custom_fields` | `GET` | `/pim/saveCustomFields` | `OrangeHRM\Pim\Controller\SaveCustomFieldController::handle` |
| `orangehrmPimPlugin` | `edit_custom_fields` | `GET` | `/pim/saveCustomFields/{id}` | `OrangeHRM\Pim\Controller\SaveCustomFieldController::handle` |
| `orangehrmPimPlugin` | `view_optional_field` | `GET` | `/pim/configurePim` | `OrangeHRM\Pim\Controller\OptionalFieldController::handle` |
| `orangehrmPimPlugin` | `pim_employee_immigration` | `GET` | `/pim/viewImmigration/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\EmployeeImmigrationController::handle` |
| `orangehrmPimPlugin` | `pim_employee_membership` | `GET` | `/pim/viewMemberships/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\EmployeeMembershipController::handle` |
| `orangehrmPimPlugin` | `pim_employee_tax_exemption` | `GET` | `/pim/viewUsTaxExemptions/empNumber/{empNumber}` | `OrangeHRM\Pim\Controller\EmpUsTaxExemptionController::handle` |
| `orangehrmPimPlugin` | `pim_employee_csv_import` | `GET` | `/pim/pimCsvImport` | `OrangeHRM\Pim\Controller\EmployeeCsvImportController::handle` |
| `orangehrmPimPlugin` | `pim_view_employee_reports` | `GET` | `/pim/viewDefinedPredefinedReports` | `OrangeHRM\Pim\Controller\EmployeeReportController::handle` |
| `orangehrmPimPlugin` | `pim_save_employee_reports` | `GET` | `/pim/definePredefinedReport` | `OrangeHRM\Pim\Controller\SaveEmployeeReportController::handle` |
| `orangehrmPimPlugin` | `pim_edit_employee_reports` | `GET` | `/pim/definePredefinedReport/{id}` | `OrangeHRM\Pim\Controller\SaveEmployeeReportController::handle` |
| `orangehrmPimPlugin` | `pim_display_employee_report` | `GET` | `/pim/displayPredefinedReport/{id}` | `OrangeHRM\Pim\Controller\EmployeeReportController::handle` |
| `orangehrmPimPlugin` | `update_password` | `GET` | `/pim/updatePassword` | `OrangeHRM\Pim\Controller\UpdatePasswordController::handle` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_vacancy` | `GET, PUT` | `/api/v2/recruitment/vacancies/{id}` | `OrangeHRM\Recruitment\Api\VacancyAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_vacancies` | `GET, POST, DELETE` | `/api/v2/recruitment/vacancies` | `OrangeHRM\Recruitment\Api\VacancyAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_vacancies_attachments` | `GET` | `/api/v2/recruitment/vacancies/{vacancyId}/attachments` | `OrangeHRM\Recruitment\Api\VacancyAttachmentAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_vacancies_attachment` | `PUT` | `/api/v2/recruitment/vacancies/{vacancyId}/attachments/{attachmentId}` | `OrangeHRM\Recruitment\Api\VacancyAttachmentAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_vacancy_attachments` | `POST, DELETE` | `/api/v2/recruitment/vacancy/attachments` | `OrangeHRM\Recruitment\Api\VacancyAttachmentAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidates` | `GET, POST, DELETE` | `/api/v2/recruitment/candidates` | `OrangeHRM\Recruitment\Api\CandidateAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidate` | `GET, PUT` | `/api/v2/recruitment/candidates/{id}` | `OrangeHRM\Recruitment\Api\CandidateAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidate_attachment` | `GET, PUT` | `/api/v2/recruitment/candidate/{candidateId}/attachment` | `OrangeHRM\Recruitment\Api\CandidateAttachmentAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidate_attachments` | `POST` | `/api/v2/recruitment/candidate/attachments` | `OrangeHRM\Recruitment\Api\CandidateAttachmentAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidate_status` | `GET` | `/api/v2/recruitment/candidates/statuses` | `OrangeHRM\Recruitment\Api\CandidateStatusAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_hiring_managers` | `GET` | `/api/v2/recruitment/hiring-managers` | `OrangeHRM\Recruitment\Api\HiringManagerAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidates_allowed_actions` | `GET` | `/api/v2/recruitment/candidates/{candidateId}/actions/allowed` | `OrangeHRM\Recruitment\Api\CandidateAllowedActionAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidates_reject` | `PUT` | `/api/v2/recruitment/candidates/{candidateId}/reject` | `OrangeHRM\Recruitment\Api\CandidateRejectionAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidates_shortlist` | `PUT` | `/api/v2/recruitment/candidates/{candidateId}/shortlist` | `OrangeHRM\Recruitment\Api\CandidateShortlistingAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidates_schedule_interview` | `POST` | `/api/v2/recruitment/candidates/{candidateId}/shedule-interview` | `OrangeHRM\Recruitment\Api\CandidateInterviewSchedulingAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidates_interviews` | `GET, PUT` | `/api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}` | `OrangeHRM\Recruitment\Api\CandidateInterviewSchedulingAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_interviews_attachment` | `GET, PUT` | `/api/v2/recruitment/interviews/{interviewId}/attachments/{attachmentId}` | `OrangeHRM\Recruitment\Api\InterviewAttachmentAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_interview_attachments` | `GET, POST, DELETE` | `/api/v2/recruitment/interviews/{interviewId}/attachments` | `OrangeHRM\Recruitment\Api\InterviewAttachmentAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidates_mark_interview_passed` | `PUT` | `/api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}/pass` | `OrangeHRM\Recruitment\Api\CandidateMarkingInterviewPassAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidates_mark_interview_failed` | `PUT` | `/api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}/fail` | `OrangeHRM\Recruitment\Api\CandidateMarkingInterviewFailAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidates_offer_job` | `PUT` | `/api/v2/recruitment/candidates/{candidateId}/job/offer` | `OrangeHRM\Recruitment\Api\CandidateJobOfferingAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidates_offer_decline` | `PUT` | `/api/v2/recruitment/candidates/{candidateId}/job/decline` | `OrangeHRM\Recruitment\Api\CandidateOfferDecliningAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidates_hire` | `PUT` | `/api/v2/recruitment/candidates/{candidateId}/hire` | `OrangeHRM\Recruitment\Api\CandidateHiringAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidates_history` | `GET` | `/api/v2/recruitment/candidates/{candidateId}/history` | `OrangeHRM\Recruitment\Api\CandidateHistoryAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_candidate_history` | `GET, PUT` | `/api/v2/recruitment/candidates/{candidateId}/history/{historyId}` | `OrangeHRM\Recruitment\Api\CandidateHistoryAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_interviewers` | `GET` | `/api/v2/recruitment/interviewers` | `OrangeHRM\Recruitment\Api\EmployeeListAPI` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_public_vacancies` | `GET` | `/api/v2/recruitment/public/vacancies` | `OrangeHRM\Recruitment\Controller\PublicController\VacancyListRestController::handle` |
| `orangehrmRecruitmentPlugin` | `apiv2_recruitment_public_vacancy` | `GET` | `/api/v2/recruitment/public/vacancies/{id}` | `OrangeHRM\Recruitment\Controller\PublicController\VacancyRestController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_vacancy_attachment` | `GET` | `/recruitment/viewVacancyAttachment/attachId/{attachId}` | `OrangeHRM\Recruitment\Controller\File\VacancyAttachment::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_candidate_attachment` | `GET` | `/recruitment/viewCandidateAttachment/candidateId/{candidateId}` | `OrangeHRM\Recruitment\Controller\File\CandidateAttachment::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_interview_attachment` | `GET` | `/recruitment/viewInterviewAttachment/interview/{interviewId}/attachment/{attachmentId}` | `OrangeHRM\Recruitment\Controller\File\InterviewAttachment::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_module` | `GET` | `/recruitment/viewRecruitmentModule` | `OrangeHRM\Recruitment\Controller\RecruitmentModuleController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_view_job_vacancy` | `GET` | `/recruitment/viewJobVacancy` | `OrangeHRM\Recruitment\Controller\ViewJobVacancyController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_add_job_vacancy` | `GET` | `/recruitment/addJobVacancy` | `OrangeHRM\Recruitment\Controller\AddJobVacancyController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_edit_job_vacancy` | `GET` | `/recruitment/addJobVacancy/{id}` | `OrangeHRM\Recruitment\Controller\EditJobVacancyController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_view_candidates` | `GET` | `/recruitment/viewCandidates` | `OrangeHRM\Recruitment\Controller\ViewCandidateController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_save_candidates` | `GET` | `/recruitment/addCandidate` | `OrangeHRM\Recruitment\Controller\SaveCandidateController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_view_candidate_profile` | `GET` | `/recruitment/addCandidate/{id}` | `OrangeHRM\Recruitment\Controller\SaveCandidateController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_candidate_action` | `GET` | `/recruitment/changeCandidateVacancyStatus` | `OrangeHRM\Recruitment\Controller\CandidateActionController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_view_action_history` | `GET` | `/recruitment/candidateHistory/{candidateId}/{historyId}` | `OrangeHRM\Recruitment\Controller\WorkflowActionHistoryController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_view_interview_attachments` | `GET` | `/recruitment/interviewAttachments/{interviewId}` | `OrangeHRM\Recruitment\Controller\InterviewAttachmentsController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_view_vacancy_list` | `GET` | `/recruitmentApply/jobs.html` | `OrangeHRM\Recruitment\Controller\PublicController\VacancyListViewController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_apply_job_vacancy` | `GET` | `/recruitmentApply/applyVacancy/id/{id}` | `OrangeHRM\Recruitment\Controller\PublicController\ApplyJobVacancyViewController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_public_applicants` | `POST` | `/recruitment/public/applicants` | `OrangeHRM\Recruitment\Controller\PublicController\ApplicantController::handle` |
| `orangehrmRecruitmentPlugin` | `recruitment_rss_feed` | `GET` | `/recruitmentApply/jobs.rss` | `OrangeHRM\Recruitment\Controller\PublicController\VacancyListRSSController::handle` |
| `orangehrmSystemCheckPlugin` | `apiv2_core_system_check` | `GET` | `/api/v2/core/system-check` | `OrangeHRM\SystemCheck\PublicApi\SystemCheckAPI` |
| `orangehrmSystemCheckPlugin` | `core_system_check` | `GET` | `/core/system-check` | `OrangeHRM\SystemCheck\Controller\SystemCheckController::handle` |
| `orangehrmTimePlugin` | `apiv2_time_project` | `GET, PUT` | `/api/v2/time/projects/{id}` | `OrangeHRM\Time\Api\ProjectAPI` |
| `orangehrmTimePlugin` | `apiv2_time_projects` | `GET, POST, DELETE` | `/api/v2/time/projects` | `OrangeHRM\Time\Api\ProjectAPI` |
| `orangehrmTimePlugin` | `apiv2_time_validate_project_name` | `GET` | `/api/v2/time/validation/project-name` | `OrangeHRM\Time\Api\ValidateProjectNameAPI` |
| `orangehrmTimePlugin` | `apiv2_time_time_sheet_period_config` | `GET, PUT` | `/api/v2/time/time-sheet-period` | `OrangeHRM\Time\Api\TimeConfigPeriodAPI` |
| `orangehrmTimePlugin` | `apiv2_time_customer` | `GET, PUT` | `/api/v2/time/customers/{id}` | `OrangeHRM\Time\Api\CustomerAPI` |
| `orangehrmTimePlugin` | `apiv2_time_customers` | `GET, POST, DELETE` | `/api/v2/time/customers` | `OrangeHRM\Time\Api\CustomerAPI` |
| `orangehrmTimePlugin` | `apiv2_time_validate_customer_name` | `GET` | `/api/v2/time/validation/customer-name` | `OrangeHRM\Time\Api\ValidationCustomerNameAPI` |
| `orangehrmTimePlugin` | `apiv2_time_project_activities` | `GET, POST, DELETE` | `/api/v2/time/project/{projectId}/activities` | `OrangeHRM\Time\Api\ProjectActivityAPI` |
| `orangehrmTimePlugin` | `apiv2_time_project_activity` | `GET, PUT` | `/api/v2/time/project/{projectId}/activities/{id}` | `OrangeHRM\Time\Api\ProjectActivityAPI` |
| `orangehrmTimePlugin` | `apiv2_time_validate_project_activity_name` | `GET` | `/api/v2/time/validation/activity-name/{id}` | `OrangeHRM\Time\Api\ValidationProjectActivityNameAPI` |
| `orangehrmTimePlugin` | `apiv2_time_my_time_sheets` | `GET, POST` | `/api/v2/time/timesheets` | `OrangeHRM\Time\Api\MyTimesheetAPI` |
| `orangehrmTimePlugin` | `apiv2_time_my_time_sheet` | `PUT` | `/api/v2/time/timesheets/{id}` | `OrangeHRM\Time\Api\MyTimesheetAPI` |
| `orangehrmTimePlugin` | `apiv2_time_employee_time_sheets` | `GET, POST` | `/api/v2/time/employees/{empNumber}/timesheets` | `OrangeHRM\Time\Api\EmployeeTimesheetAPI` |
| `orangehrmTimePlugin` | `apiv2_time_employee_time_sheet` | `PUT` | `/api/v2/time/employees/{empNumber}/timesheets/{id}` | `OrangeHRM\Time\Api\EmployeeTimesheetAPI` |
| `orangehrmTimePlugin` | `apiv2_time_default_time_sheet` | `GET` | `/api/v2/time/timesheets/default` | `OrangeHRM\Time\Api\DefaultTimesheetAPI` |
| `orangehrmTimePlugin` | `apiv2_time_my_timesheets_entries` | `GET, PUT` | `/api/v2/time/timesheets/{timesheetId}/entries` | `OrangeHRM\Time\Api\MyTimesheetItemAPI` |
| `orangehrmTimePlugin` | `apiv2_time_employees_timesheets_entries` | `GET, PUT` | `/api/v2/time/employees/timesheets/{timesheetId}/entries` | `OrangeHRM\Time\Api\EmployeeTimesheetItemAPI` |
| `orangehrmTimePlugin` | `apiv2_time_timesheet_action_log` | `GET` | `/api/v2/time/timesheets/{timesheetId}/action-logs` | `OrangeHRM\Time\Api\TimesheetActionLogAPI` |
| `orangehrmTimePlugin` | `apiv2_time_timesheet_project_activity_unique_validation` | `GET` | `/api/v2/time/validation/{timesheetId}/project-activity` | `OrangeHRM\Time\Api\TimesheetProjectActivityUniqueValidationAPI` |
| `orangehrmTimePlugin` | `apiv2_time_my_timesheet_entries_comments` | `PUT` | `/api/v2/time/timesheets/{timesheetId}/entries/comment` | `OrangeHRM\Time\Api\TimesheetCommentAPI` |
| `orangehrmTimePlugin` | `apiv2_time_my_timesheet_entries_comment` | `GET` | `/api/v2/time/timesheets/{timesheetId}/entries/{id}/comment` | `OrangeHRM\Time\Api\TimesheetCommentAPI` |
| `orangehrmTimePlugin` | `apiv2_time_my_timesheet_time_format_config` | `GET` | `/api/v2/time/config/time-format` | `OrangeHRM\Time\Api\TimesheetTimeFormatAPI` |
| `orangehrmTimePlugin` | `apiv2_time_copy_activity` | `GET, POST` | `/api/v2/time/projects/{toProjectId}/activities/copy/{fromProjectId}` | `OrangeHRM\Time\Api\CopyProjectActivityAPI` |
| `orangehrmTimePlugin` | `apiv2_time_employee_timesheets_list` | `GET` | `/api/v2/time/employees/timesheets/list` | `OrangeHRM\Time\Api\EmployeeTimesheetListAPI` |
| `orangehrmTimePlugin` | `apiv2_time_reports` | `GET` | `/api/v2/time/reports` | `OrangeHRM\Time\Api\TimeReportAPI` |
| `orangehrmTimePlugin` | `apiv2_time_reports_data` | `GET` | `/api/v2/time/reports/data` | `OrangeHRM\Time\Api\TimeReportDataAPI` |
| `orangehrmTimePlugin` | `apiv2_time_project_admins` | `GET` | `/api/v2/time/project-admins` | `OrangeHRM\Time\Api\ProjectAdminAPI` |
| `orangehrmTimePlugin` | `time_module` | `GET` | `/time/viewTimeModule` | `OrangeHRM\Time\Controller\TimeModuleController::handle` |
| `orangehrmTimePlugin` | `view_time_sheet_config` | `GET` | `/time/defineTimesheetPeriod` | `OrangeHRM\Time\Controller\TimesheetPeriodConfigController::handle` |
| `orangehrmTimePlugin` | `view_customers` | `GET` | `/time/viewCustomers` | `OrangeHRM\Time\Controller\CustomerController::handle` |
| `orangehrmTimePlugin` | `save_customer` | `GET` | `/time/addCustomer` | `OrangeHRM\Time\Controller\SaveCustomerController::handle` |
| `orangehrmTimePlugin` | `edit_customer` | `GET` | `/time/addCustomer/{id}` | `OrangeHRM\Time\Controller\SaveCustomerController::handle` |
| `orangehrmTimePlugin` | `time_my_timesheet` | `GET` | `/time/viewMyTimesheet` | `OrangeHRM\Time\Controller\MyTimesheetController::handle` |
| `orangehrmTimePlugin` | `time_edit_timesheet` | `GET` | `/time/editTimesheet/{id}` | `OrangeHRM\Time\Controller\EditTimesheetController::handle` |
| `orangehrmTimePlugin` | `time_view_projects` | `GET` | `/time/viewProjects` | `OrangeHRM\Time\Controller\ProjectController::handle` |
| `orangehrmTimePlugin` | `time_save_project` | `GET` | `/time/saveProject` | `OrangeHRM\Time\Controller\SaveProjectController::handle` |
| `orangehrmTimePlugin` | `time_edit_project` | `GET` | `/time/saveProject/{id}` | `OrangeHRM\Time\Controller\SaveProjectController::handle` |
| `orangehrmTimePlugin` | `time_employee_timesheet` | `GET` | `/time/viewEmployeeTimesheet` | `OrangeHRM\Time\Controller\EmployeeTimesheetController::handle` |
| `orangehrmTimePlugin` | `time_employee_view_timesheet` | `GET` | `/time/viewTimesheet/employeeId/{id}` | `OrangeHRM\Time\Controller\EmployeeTimesheetController::handle` |
| `orangehrmTimePlugin` | `time_employee_report` | `GET` | `/time/displayEmployeeReportCriteria` | `OrangeHRM\Time\Controller\EmployeeTimeReportController::handle` |
| `orangehrmTimePlugin` | `time_project_activity_report` | `GET` | `/time/displayProjectReportCriteria` | `OrangeHRM\Time\Controller\ProjectActivityReportController::handle` |
| `orangehrmTimePlugin` | `time_activity_details_report` | `GET` | `/time/displayProjectActivityDetailsReport` | `OrangeHRM\Time\Controller\ActivityDetailsReportController::handle` |
