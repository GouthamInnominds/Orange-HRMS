/**
 * OrangeHRM QKG Global Specification Extractor
 * Extracts all Business Domains, Workflows, Features, Requirement Groups,
 * Requirements (FR/NFR), and Business Rules from the baseline documents.
 */

const fs = require('fs');
const path = require('path');

// Deterministic normalization from baseline TestStrategy descriptive requirement_ids -> canonical spec FR/NFR IDs
const BASELINE_REQ_PREFIX_RULES = [
  [/^FR_ADM_(JOB|PAY_GRADE|EMPLOYMENT_STATUS|WORK_SHIFT|SKILL|QUALIFICATION|NATIONALITY|LANGUAGE|I18N)/, 'FR_ADM_001'],
  [/^FR_ADM_(SYSTEM_USER|USERNAME|EMAIL|MODULES)/, 'FR_ADM_002'],
  [/^FR_ADM_(ORGANIZATION|LOCATION)/, 'FR_ADM_003'],
  [/^FR_AUTH_/, 'FR_ADM_002'],
  [/^FR_PIM_(JOB_DETAILS)/, 'FR_PIM_002'],
  [/^FR_PIM_(REPORT_TO)/, 'FR_PIM_003'],
  [/^FR_PIM_(SALARY)/, 'FR_PIM_004'],
  [/^FR_PIM_/, 'FR_PIM_001'],
  [/^FR_DIR_/, 'FR_PIM_001'],
  [/^FR_LEV_(LEAVE_ENTITLEMENT|HOLIDAY|LEAVE_PERIOD|WORK_WEEK|LEAVE_TYPE)/, 'FR_LEV_001'],
  [/^FR_LEV_(APPLY|ASSIGN)/, 'FR_LEV_002'],
  [/^FR_LEV_/, 'FR_LEV_003'],
  [/^FR_TIM_(CUSTOMER|PROJECT)/, 'FR_TIM_002'],
  [/^FR_TIM_/, 'FR_TIM_001'],
  [/^FR_ATT_/, 'FR_ATT_001'],
  [/^FR_REC_(VACANC)/, 'FR_REC_001'],
  [/^FR_REC_(INTERVIEW)/, 'FR_REC_003'],
  [/^FR_REC_/, 'FR_REC_002'],
  [/^FR_PRF_/, 'FR_PRF_001'],
  [/^FR_CLM_/, 'FR_CLM_001'],
  [/^FR_BUZZ_/, 'FR_BUZ_001'],
  [/^FR_MNT_/, 'FR_MNT_001']
];

// Verified endpoint path aliases from user_stories.json shorthand -> actual Symfony routes.yaml IDs
const STORY_ENDPOINT_ALIASES = {
  'PUT /api/v2/pim/employees/{id}/contact-details': 'PUT /api/v2/pim/employee/{empNumber}/contact-details',
  'POST /api/v2/pim/employees/{id}/termination': 'POST /api/v2/pim/employees/{empNumber}/terminations',
  'DELETE /api/v2/pim/employees/{id}/termination': 'DELETE /api/v2/pim/employees/{empNumber}/terminations',
  'DELETE /api/v2/admin/job-titles/{id}': 'DELETE /api/v2/admin/job-titles',
  'GET /api/v2/leave/work-week': 'GET /api/v2/leave/workweek',
  'PUT /api/v2/time/timesheets/{id}/action': 'PUT /api/v2/time/timesheets/{id}',
  'POST /api/v2/time/activities': 'POST /api/v2/time/project/{projectId}/activities',
  'POST /api/v2/recruitment/candidates/{id}/attachments': 'POST /api/v2/recruitment/candidate/attachments',
  'POST /api/v2/recruitment/candidates/{id}/interviews': 'POST /api/v2/recruitment/candidates/{candidateId}/shedule-interview',
  'PUT /api/v2/recruitment/candidates/{id}/action': 'PUT /api/v2/recruitment/candidates/{candidateId}/shortlist',
  'POST /api/v2/maintenance/purge-employee-data': 'DELETE /api/v2/maintenance/purge',
  'POST /api/v2/maintenance/purge-candidate-data': 'DELETE /api/v2/maintenance/candidates/purge',
  'POST /api/v2/auth/login': 'POST /auth/validate',
  'POST /api/v2/auth/logout': 'GET /auth/logout',
  'POST /api/v2/auth/password-strength': 'POST /api/v2/auth/public/validation/password'
};

// Verified UI component filename aliases from user_stories.json -> actual OrangeHRM Vue SFC filenames
const STORY_UI_ALIASES = {
  'EmployeeSalary.vue': 'SaveSalaryComponent.vue',
  'EmployeeEmergencyContacts.vue': 'SaveEmergencyContact.vue',
  'User.vue': 'SystemUser.vue',
  'SaveUser.vue': 'SaveSystemUser.vue',
  'OrganizationStructure.vue': 'OrgStructure.vue',
  'Location.vue': 'LocationList.vue',
  'PayGrade.vue': 'AddPayGrade.vue',
  'AddLeaveEntitlement.vue': 'AddEntitlement.vue',
  'LeaveEntitlementList.vue': 'LeaveEntitlements.vue',
  'ApplyLeave.vue': 'LeaveApply.vue',
  'LeaveActionDialog.vue': 'LeaveBulkActionModal.vue',
  'HolidayList.vue': 'SaveHoliday.vue',
  'MyTimesheet.vue': 'Timesheet.vue',
  'TimesheetGrid.vue': 'EditTimeSheet.vue',
  'ProjectList.vue': 'Project.vue',
  'SaveProject.vue': 'ProjectSave.vue',
  'MyAttendanceRecord.vue': 'ViewMyAttendance.vue',
  'SaveVacancy.vue': 'AddJobVacancy.vue',
  'CandidateList.vue': 'ViewCandidatesList.vue',
  'InterviewList.vue': 'ViewActionHistory.vue',
  'ScheduleInterview.vue': 'InterviewScheduleAction.vue',
  'KpiList.vue': 'KpiSearch.vue',
  'SaveKpi.vue': 'KpiSave.vue',
  'PerformanceTrackerList.vue': 'PerformanceTrackers.vue',
  'SavePerformanceTrackerLog.vue': 'AddTrackerLogModal.vue',
  'MyClaimList.vue': 'MyClaims.vue',
  'ClaimList.vue': 'AssignClaim.vue',
  'ClaimActionDialog.vue': 'ClaimActionButtons.vue',
  'BuzzFeed.vue': 'ViewBuzz.vue',
  'PostShare.vue': 'SharePostModal.vue',
  'BuzzComments.vue': 'PostCommentContainer.vue',
  'DirectoryList.vue': 'CorporateDirectory.vue',
  'EmployeeCard.vue': 'SummaryCard.vue',
  'PurgeEmployeeData.vue': 'PurgeEmployee.vue',
  'PurgeCandidateData.vue': 'PurgeCandidate.vue'
};

function normalizeParamPath(epSpec) {
  if (!epSpec) return null;
  const trimmed = String(epSpec).trim();
  const spaceIdx = trimmed.indexOf(' ');
  if (spaceIdx === -1) return trimmed.replace(/\{[^}]+\}/g, '{param}').replace(/\/+$/, '');
  const method = trimmed.slice(0, spaceIdx).toUpperCase();
  const route = trimmed.slice(spaceIdx + 1).trim().replace(/\{[^}]+\}/g, '{param}').replace(/\/+$/, '') || '/';
  return `${method} ${route}`;
}

function resolveRequirementAlias(rawReqId, validReqSet = null) {
  if (!rawReqId) return null;
  const clean = String(rawReqId).trim();
  if (!validReqSet || validReqSet.has(clean)) {
    if (!validReqSet) {
      // Fall through to check prefix rules when validReqSet isn't passed only if it looks non-canonical
      if (/^(FR|NFR)_[A-Z]{3}_\d{3}$/.test(clean)) return clean;
    } else {
      return clean;
    }
  }
  for (const [re, canonical] of BASELINE_REQ_PREFIX_RULES) {
    if (re.test(clean)) return canonical;
  }
  return clean;
}

class GlobalSpecExtractor {
  constructor(baselineDir) {
    this.baselineDir = baselineDir;
  }

  extractAllSpecifications() {
    // 1. All 12 Business Domains
    const domains = [
      { domain_id: 'DOMAIN_PIM', name: 'Workforce & Personal Information Management', plugin: 'orangehrmPimPlugin' },
      { domain_id: 'DOMAIN_ADM', name: 'System & Organization Administration', plugin: 'orangehrmAdminPlugin' },
      { domain_id: 'DOMAIN_LEV', name: 'Leave & Absence Management', plugin: 'orangehrmLeavePlugin' },
      { domain_id: 'DOMAIN_TIM', name: 'Time & Timesheet Tracking', plugin: 'orangehrmTimePlugin' },
      { domain_id: 'DOMAIN_ATT', name: 'Attendance & Punch Management', plugin: 'orangehrmAttendancePlugin' },
      { domain_id: 'DOMAIN_REC', name: 'Talent Acquisition & Candidate Pipeline', plugin: 'orangehrmRecruitmentPlugin' },
      { domain_id: 'DOMAIN_PRF', name: 'Performance & Appraisal Trackers', plugin: 'orangehrmPerformancePlugin' },
      { domain_id: 'DOMAIN_CLM', name: 'Travel & Expense Claims', plugin: 'orangehrmClaimPlugin' },
      { domain_id: 'DOMAIN_BUZ', name: 'Corporate Collaboration Feed', plugin: 'orangehrmBuzzPlugin' },
      { domain_id: 'DOMAIN_DIR', name: 'Corporate Directory & Organization Chart', plugin: 'orangehrmCorporateDirectoryPlugin' },
      { domain_id: 'DOMAIN_MNT', name: 'Compliance & Data Purge Maintenance', plugin: 'orangehrmMaintenancePlugin' },
      { domain_id: 'DOMAIN_AUT', name: 'Authentication & Identity Provisioning', plugin: 'orangehrmAuthenticationPlugin' }
    ];

    // 2. All Major Business Workflows
    const workflows = [
      { workflow_id: 'WF_ONBOARDING', domain_id: 'DOMAIN_PIM', name: 'Employee Onboarding to Operational Readiness', type: 'CoreLifecycle' },
      { workflow_id: 'WF_SEPARATION', domain_id: 'DOMAIN_PIM', name: 'Employee Termination & Offboarding', type: 'ExitLifecycle' },
      { workflow_id: 'WF_LEAVE_LIFECYCLE', domain_id: 'DOMAIN_LEV', name: 'Leave Application, Approval & Balance Settlement', type: 'Transactional' },
      { workflow_id: 'WF_TIMESHEET_CYCLE', domain_id: 'DOMAIN_TIM', name: 'Weekly Timesheet Activity Logging & Supervisory Sign-off', type: 'Transactional' },
      { workflow_id: 'WF_ATTENDANCE_PUNCH', domain_id: 'DOMAIN_ATT', name: 'Daily Attendance Punch & Shift Verification', type: 'Transactional' },
      { workflow_id: 'WF_RECRUITMENT_PIPELINE', domain_id: 'DOMAIN_REC', name: 'Candidate Application, Interview & Hiring Journey', type: 'TalentAcquisition' },
      { workflow_id: 'WF_APPRAISAL_CYCLE', domain_id: 'DOMAIN_PRF', name: 'Performance Review, KPI Scoring & Reviewer Rating', type: 'Appraisal' },
      { workflow_id: 'WF_EXPENSE_CLAIM', domain_id: 'DOMAIN_CLM', name: 'Travel & Expense Filing with Receipt Verification', type: 'Reimbursement' },
      { workflow_id: 'WF_BUZZ_COLLABORATION', domain_id: 'DOMAIN_BUZ', name: 'Corporate Social Sharing & Peer Engagement', type: 'Collaboration' },
      { workflow_id: 'WF_DATA_PURGE', domain_id: 'DOMAIN_MNT', name: 'GDPR Historical Personal Record Purge', type: 'Compliance' }
    ];

    // 3. Features mapped to workflows and domains
    const features = [
      { feature_id: 'FEAT_PIM_EMPLOYEE_MASTER', domain_id: 'DOMAIN_PIM', workflow_id: 'WF_ONBOARDING', name: 'Employee Master Record Management' },
      { feature_id: 'FEAT_PIM_JOB_DETAILS', domain_id: 'DOMAIN_PIM', workflow_id: 'WF_ONBOARDING', name: 'Job & Organizational Placement' },
      { feature_id: 'FEAT_PIM_REPORT_TO', domain_id: 'DOMAIN_PIM', workflow_id: 'WF_ONBOARDING', name: 'Reporting Hierarchy & Supervision' },
      { feature_id: 'FEAT_PIM_SALARY', domain_id: 'DOMAIN_PIM', workflow_id: 'WF_ONBOARDING', name: 'Salary & Compensation Components' },
      { feature_id: 'FEAT_PIM_PERSONAL_CONTACT', domain_id: 'DOMAIN_PIM', workflow_id: 'WF_ONBOARDING', name: 'Personal & Contact Details' },
      { feature_id: 'FEAT_PIM_TERMINATION', domain_id: 'DOMAIN_PIM', workflow_id: 'WF_SEPARATION', name: 'Employee Termination Lifecycle' },
      
      { feature_id: 'FEAT_ADM_JOB_TITLE', domain_id: 'DOMAIN_ADM', workflow_id: 'WF_ONBOARDING', name: 'Job Titles & Specifications' },
      { feature_id: 'FEAT_ADM_USER_MGMT', domain_id: 'DOMAIN_ADM', workflow_id: 'WF_ONBOARDING', name: 'User Account & Role Governance' },
      { feature_id: 'FEAT_ADM_ORGANIZATION', domain_id: 'DOMAIN_ADM', workflow_id: 'WF_ONBOARDING', name: 'Organization Structure & Subunits' },
      { feature_id: 'FEAT_ADM_PAY_GRADE', domain_id: 'DOMAIN_ADM', workflow_id: 'WF_ONBOARDING', name: 'Pay Grades & Currencies' },
      { feature_id: 'FEAT_ADM_EMPLOYMENT_STATUS', domain_id: 'DOMAIN_ADM', workflow_id: 'WF_ONBOARDING', name: 'Employment Statuses' },

      { feature_id: 'FEAT_LEV_ENTITLEMENT', domain_id: 'DOMAIN_LEV', workflow_id: 'WF_LEAVE_LIFECYCLE', name: 'Leave Entitlement Allocation' },
      { feature_id: 'FEAT_LEV_APPLICATION', domain_id: 'DOMAIN_LEV', workflow_id: 'WF_LEAVE_LIFECYCLE', name: 'Leave Application & Deduction' },
      { feature_id: 'FEAT_LEV_APPROVAL', domain_id: 'DOMAIN_LEV', workflow_id: 'WF_LEAVE_LIFECYCLE', name: 'Supervisory Leave Approval' },
      { feature_id: 'FEAT_LEV_CALENDAR', domain_id: 'DOMAIN_LEV', workflow_id: 'WF_LEAVE_LIFECYCLE', name: 'Company Holidays & Work Week' },

      { feature_id: 'FEAT_TIM_TIMESHEET', domain_id: 'DOMAIN_TIM', workflow_id: 'WF_TIMESHEET_CYCLE', name: 'Weekly Timesheet Submission' },
      { feature_id: 'FEAT_TIM_PROJECT', domain_id: 'DOMAIN_TIM', workflow_id: 'WF_TIMESHEET_CYCLE', name: 'Customer & Project Tracking' },
      { feature_id: 'FEAT_ATT_PUNCH', domain_id: 'DOMAIN_ATT', workflow_id: 'WF_ATTENDANCE_PUNCH', name: 'Daily Punch Clock & Shifts' },

      { feature_id: 'FEAT_REC_VACANCY', domain_id: 'DOMAIN_REC', workflow_id: 'WF_RECRUITMENT_PIPELINE', name: 'Job Vacancy Management' },
      { feature_id: 'FEAT_REC_CANDIDATE', domain_id: 'DOMAIN_REC', workflow_id: 'WF_RECRUITMENT_PIPELINE', name: 'Candidate Resume Ingestion' },
      { feature_id: 'FEAT_REC_INTERVIEW', domain_id: 'DOMAIN_REC', workflow_id: 'WF_RECRUITMENT_PIPELINE', name: 'Interview Scheduling & Rating' },

      { feature_id: 'FEAT_PRF_KPI', domain_id: 'DOMAIN_PRF', workflow_id: 'WF_APPRAISAL_CYCLE', name: 'Key Performance Indicators' },
      { feature_id: 'FEAT_PRF_TRACKER', domain_id: 'DOMAIN_PRF', workflow_id: 'WF_APPRAISAL_CYCLE', name: 'Performance Trackers & Logs' },
      { feature_id: 'FEAT_PRF_APPRAISAL', domain_id: 'DOMAIN_PRF', workflow_id: 'WF_APPRAISAL_CYCLE', name: 'Appraisal Reviews & Evaluations' },

      { feature_id: 'FEAT_CLM_EVENT', domain_id: 'DOMAIN_CLM', workflow_id: 'WF_EXPENSE_CLAIM', name: 'Claim Events & Expense Types' },
      { feature_id: 'FEAT_CLM_EXPENSE', domain_id: 'DOMAIN_CLM', workflow_id: 'WF_EXPENSE_CLAIM', name: 'Expense Filing & Receipts' },
      { feature_id: 'FEAT_CLM_APPROVAL', domain_id: 'DOMAIN_CLM', workflow_id: 'WF_EXPENSE_CLAIM', name: 'Expense Claim Approval' },

      { feature_id: 'FEAT_BUZ_POSTS', domain_id: 'DOMAIN_BUZ', workflow_id: 'WF_BUZZ_COLLABORATION', name: 'Buzz Social Posts & Multimedia' },
      { feature_id: 'FEAT_DIR_SEARCH', domain_id: 'DOMAIN_DIR', workflow_id: 'WF_ONBOARDING', name: 'Corporate Directory Search' },
      { feature_id: 'FEAT_MNT_PURGE', domain_id: 'DOMAIN_MNT', workflow_id: 'WF_DATA_PURGE', name: 'Candidate & Employee Data Purge' }
    ];

    // 4. Requirement Groups
    const requirementGroups = [
      { group_id: 'REQGRP_PIM_MASTER', feature_id: 'FEAT_PIM_EMPLOYEE_MASTER', name: 'PIM Master Data Group' },
      { group_id: 'REQGRP_PIM_JOB', feature_id: 'FEAT_PIM_JOB_DETAILS', name: 'PIM Job Allocation Group' },
      { group_id: 'REQGRP_PIM_HIERARCHY', feature_id: 'FEAT_PIM_REPORT_TO', name: 'PIM Hierarchy Group' },
      { group_id: 'REQGRP_PIM_COMP', feature_id: 'FEAT_PIM_SALARY', name: 'PIM Compensation Group' },
      
      { group_id: 'REQGRP_ADM_JOB', feature_id: 'FEAT_ADM_JOB_TITLE', name: 'Admin Job Title Group' },
      { group_id: 'REQGRP_ADM_USER', feature_id: 'FEAT_ADM_USER_MGMT', name: 'Admin User Group' },
      { group_id: 'REQGRP_ADM_ORG', feature_id: 'FEAT_ADM_ORGANIZATION', name: 'Admin Organization Group' },

      { group_id: 'REQGRP_LEV_ENT', feature_id: 'FEAT_LEV_ENTITLEMENT', name: 'Leave Entitlements Group' },
      { group_id: 'REQGRP_LEV_APP', feature_id: 'FEAT_LEV_APPLICATION', name: 'Leave Applications Group' },
      { group_id: 'REQGRP_LEV_APPR', feature_id: 'FEAT_LEV_APPROVAL', name: 'Leave Approvals Group' },

      { group_id: 'REQGRP_TIM_SHEET', feature_id: 'FEAT_TIM_TIMESHEET', name: 'Timesheets Group' },
      { group_id: 'REQGRP_TIM_PROJ', feature_id: 'FEAT_TIM_PROJECT', name: 'Projects Group' },
      { group_id: 'REQGRP_ATT_CLOCK', feature_id: 'FEAT_ATT_PUNCH', name: 'Attendance Punch Group' },

      { group_id: 'REQGRP_REC_VAC', feature_id: 'FEAT_REC_VACANCY', name: 'Recruitment Vacancy Group' },
      { group_id: 'REQGRP_REC_CAND', feature_id: 'FEAT_REC_CANDIDATE', name: 'Recruitment Candidate Group' },
      { group_id: 'REQGRP_REC_INT', feature_id: 'FEAT_REC_INTERVIEW', name: 'Recruitment Interview Group' },

      { group_id: 'REQGRP_PRF_EVAL', feature_id: 'FEAT_PRF_APPRAISAL', name: 'Performance Appraisal Group' },
      { group_id: 'REQGRP_CLM_SUBMIT', feature_id: 'FEAT_CLM_EXPENSE', name: 'Expense Submission Group' },
      { group_id: 'REQGRP_BUZ_FEED', feature_id: 'FEAT_BUZ_POSTS', name: 'Buzz Collaboration Group' },
      { group_id: 'REQGRP_MNT_GDPR', feature_id: 'FEAT_MNT_PURGE', name: 'Maintenance Purge Group' }
    ];

    // 5. Functional & Non-Functional Requirements
    const requirements = [
      // PIM FRs
      { requirement_id: 'FR_PIM_001', group_id: 'REQGRP_PIM_MASTER', title: 'Create New Employee Profile', type: 'FR', status: 'Approved', priority: 'Critical' },
      { requirement_id: 'FR_PIM_002', group_id: 'REQGRP_PIM_JOB', title: 'Employee Job Assignment', type: 'FR', status: 'Approved', priority: 'High' },
      { requirement_id: 'FR_PIM_003', group_id: 'REQGRP_PIM_HIERARCHY', title: 'Reporting Hierarchy Definition', type: 'FR', status: 'Approved', priority: 'High' },
      { requirement_id: 'FR_PIM_004', group_id: 'REQGRP_PIM_COMP', title: 'Salary Component & Compensation Management', type: 'FR', status: 'Approved', priority: 'High' },
      
      // Admin FRs
      { requirement_id: 'FR_ADM_001', group_id: 'REQGRP_ADM_JOB', title: 'Job Title & Specification Management', type: 'FR', status: 'Approved', priority: 'Critical' },
      { requirement_id: 'FR_ADM_002', group_id: 'REQGRP_ADM_USER', title: 'User Account & Role Provisioning', type: 'FR', status: 'Approved', priority: 'Critical' },
      { requirement_id: 'FR_ADM_003', group_id: 'REQGRP_ADM_ORG', title: 'Organizational Subunit Hierarchy', type: 'FR', status: 'Approved', priority: 'Medium' },

      // Leave FRs
      { requirement_id: 'FR_LEV_001', group_id: 'REQGRP_LEV_ENT', title: 'Leave Entitlement Allocation', type: 'FR', status: 'Approved', priority: 'High' },
      { requirement_id: 'FR_LEV_002', group_id: 'REQGRP_LEV_APP', title: 'Leave Application & Auto-Deduction', type: 'FR', status: 'Approved', priority: 'High' },
      { requirement_id: 'FR_LEV_003', group_id: 'REQGRP_LEV_APPR', title: 'Supervisory Leave Approval Workflow', type: 'FR', status: 'Approved', priority: 'High' },

      // Time & Attendance FRs
      { requirement_id: 'FR_TIM_001', group_id: 'REQGRP_TIM_SHEET', title: 'Project Activity Timesheet Logging', type: 'FR', status: 'Approved', priority: 'High' },
      { requirement_id: 'FR_TIM_002', group_id: 'REQGRP_TIM_PROJ', title: 'Customer & Project Definition', type: 'FR', status: 'Approved', priority: 'Medium' },
      { requirement_id: 'FR_ATT_001', group_id: 'REQGRP_ATT_CLOCK', title: 'Daily Punch Clock & Shift Recording', type: 'FR', status: 'Approved', priority: 'High' },

      // Recruitment FRs
      { requirement_id: 'FR_REC_001', group_id: 'REQGRP_REC_VAC', title: 'Job Vacancy Management', type: 'FR', status: 'Approved', priority: 'High' },
      { requirement_id: 'FR_REC_002', group_id: 'REQGRP_REC_CAND', title: 'Candidate Resume Ingestion & Status Progression', type: 'FR', status: 'Approved', priority: 'High' },
      { requirement_id: 'FR_REC_003', group_id: 'REQGRP_REC_INT', title: 'Interview Scheduling & Multi-Rater Evaluations', type: 'FR', status: 'Approved', priority: 'Medium' },

      // Performance FRs
      { requirement_id: 'FR_PRF_001', group_id: 'REQGRP_PRF_EVAL', title: 'Structured Appraisal Reviews & Scoring', type: 'FR', status: 'Approved', priority: 'Medium' },

      // Claim FRs
      { requirement_id: 'FR_CLM_001', group_id: 'REQGRP_CLM_SUBMIT', title: 'Expense Claim Filing with Receipt Verification', type: 'FR', status: 'Approved', priority: 'Medium' },

      // Buzz FRs
      { requirement_id: 'FR_BUZ_001', group_id: 'REQGRP_BUZ_FEED', title: 'Corporate Social Sharing & Peer Engagement', type: 'FR', status: 'Approved', priority: 'Low' },

      // Maintenance FRs
      { requirement_id: 'FR_MNT_001', group_id: 'REQGRP_MNT_GDPR', title: 'GDPR Historical Personal Record Purge', type: 'FR', status: 'Approved', priority: 'Critical' },

      // Non-Functional Requirements (NFRs)
      { requirement_id: 'NFR_SEC_001', group_id: 'REQGRP_PIM_COMP', title: 'Broken Object Level Authorization (BOLA/IDOR) Defense', type: 'NFR', status: 'Approved', priority: 'Critical' },
      { requirement_id: 'NFR_SEC_002', group_id: 'REQGRP_BUZ_FEED', title: 'Cross-Site Scripting (XSS) Input Sanitization', type: 'NFR', status: 'Approved', priority: 'Critical' },
      { requirement_id: 'NFR_SEC_003', group_id: 'REQGRP_PIM_MASTER', title: 'SQL Injection (SQLi) Prevention', type: 'NFR', status: 'Approved', priority: 'Critical' },
      { requirement_id: 'NFR_SEC_004', group_id: 'REQGRP_ADM_USER', title: 'Brute-Force Authentication Defense & Account Lockout', type: 'NFR', status: 'Approved', priority: 'High' },
      { requirement_id: 'NFR_PERF_001', group_id: 'REQGRP_PIM_MASTER', title: 'PIM Search Latency SLA under Load', type: 'NFR', status: 'Approved', priority: 'High' },
      { requirement_id: 'NFR_PERF_002', group_id: 'REQGRP_PIM_MASTER', title: 'Bulk Employee Import Throughput', type: 'NFR', status: 'Approved', priority: 'Medium' },
      { requirement_id: 'NFR_REL_001', group_id: 'REQGRP_LEV_APPR', title: 'External Notification Service Resilience', type: 'NFR', status: 'Approved', priority: 'High' },
      { requirement_id: 'NFR_REL_002', group_id: 'REQGRP_PIM_MASTER', title: 'Database Multi-Table Transaction Atomicity', type: 'NFR', status: 'Approved', priority: 'Critical' },
      { requirement_id: 'NFR_DATA_001', group_id: 'REQGRP_ADM_JOB', title: 'Referential Integrity & Cascade Deletion Protection', type: 'NFR', status: 'Approved', priority: 'High' },
      { requirement_id: 'NFR_DATA_002', group_id: 'REQGRP_MNT_GDPR', title: 'Personal Data Retention & Permanent Deletion Governance', type: 'NFR', status: 'Approved', priority: 'Critical' }
    ];

    // 6. Business Rules
    const businessRules = [
      { rule_id: 'BR_PIM_001', requirement_id: 'FR_PIM_001', name: 'Employee Number Uniqueness', description: 'Every employee must have a unique identifier across active and terminated staff.' },
      { rule_id: 'BR_PIM_002', requirement_id: 'FR_PIM_003', name: 'Supervisor Hierarchy Loop Prevention', description: 'Circular supervisor assignments are strictly prohibited.' },
      { rule_id: 'BR_PIM_003', requirement_id: 'FR_PIM_004', name: 'Salary Component Assignment', description: 'Salary components must belong to active Pay Grade allocated to job title.' },
      { rule_id: 'BR_PIM_005', requirement_id: 'FR_PIM_001', name: 'Termination Credential Lock', description: 'Terminating an employee automatically disables user authentication.' },
      
      { rule_id: 'BR_ADM_001', requirement_id: 'FR_ADM_001', name: 'Job Title Uniqueness', description: 'Job title names must be unique across all active titles.' },
      { rule_id: 'BR_ADM_002', requirement_id: 'FR_ADM_001', name: 'Job Title Deletion Lock', description: 'Job Title cannot be deleted if active employees currently hold that title.' },
      { rule_id: 'BR_ADM_004', requirement_id: 'FR_ADM_002', name: 'Primary Admin Account Protection', description: 'Default Global Admin account cannot be deleted or disabled.' },

      { rule_id: 'BR_LEV_001', requirement_id: 'FR_LEV_002', name: 'Leave Balance Constraint', description: 'Cannot apply for leave exceeding balance unless negative balance permitted.' },
      { rule_id: 'BR_LEV_002', requirement_id: 'FR_LEV_002', name: 'Overlapping Leave Prohibited', description: 'Strictly prohibit multiple leave applications overlapping same dates.' },
      { rule_id: 'BR_LEV_003', requirement_id: 'FR_LEV_002', name: 'Holiday & Non-Working Day Exemption', description: 'Leave deductions exclude holidays and non-working days.' },

      { rule_id: 'BR_TIM_001', requirement_id: 'FR_TIM_001', name: 'Daily Time Cap (24h)', description: 'Total logged hours across all activities cannot exceed 24h per day.' },
      { rule_id: 'BR_TIM_002', requirement_id: 'FR_ATT_001', name: 'Sequential Punch In/Out', description: 'Cannot Punch-In if previous Punch-In does not have a Punch-Out.' },
      { rule_id: 'BR_TIM_004', requirement_id: 'FR_TIM_001', name: 'Approved Timesheet Immutability', description: 'Approved timesheets are permanently locked against employee edits.' },

      { rule_id: 'BR_REC_001', requirement_id: 'FR_REC_001', name: 'Active Vacancy Prerequisite', description: 'Candidates can only apply to open, active vacancies.' },
      { rule_id: 'BR_CLM_001', requirement_id: 'FR_CLM_001', name: 'Claim Currency Constraint', description: 'All expense items must adhere to authorized currency for event.' }
    ];

    // 7. Personas
    const personas = [
      { persona_id: 'PERSONA_GLOBAL_ADMIN', name: 'Global System Administrator', role: 'Admin' },
      { persona_id: 'PERSONA_HR_MANAGER', name: 'HR Operations Manager', role: 'HR_Manager' },
      { persona_id: 'PERSONA_SUPERVISOR', name: 'People Manager / Team Lead', role: 'Supervisor' },
      { persona_id: 'PERSONA_EMPLOYEE', name: 'General Employee (ESS)', role: 'Employee' },
      { persona_id: 'PERSONA_APPLICANT', name: 'External Candidate / Job Applicant', role: 'Applicant' }
    ];

    // 8. User Stories
    const userStoriesFile = path.join(this.baselineDir, '01_Business_Requirements', 'user_stories.json');
    const userStories = fs.existsSync(userStoriesFile) ? JSON.parse(fs.readFileSync(userStoriesFile, 'utf8')) : [];

    return { domains, workflows, features, requirementGroups, requirements, businessRules, personas, userStories };
  }

  /**
   * Resolves baseline user story target_endpoints and target_ui_components against
   * live extracted endpoints and Vue components without fabricating non-existent targets.
   */
  resolveStoryTargets(userStories = [], domains = [], apiEndpoints = [], uiComponents = []) {
    const domainPluginMap = new Map(domains.map((d) => [d.domain_id, d.plugin]));
    const epExact = new Set(apiEndpoints.map((e) => e.endpoint_id));
    const epByNorm = new Map();
    for (const e of apiEndpoints) {
      epByNorm.set(normalizeParamPath(e.endpoint_id), e.endpoint_id);
    }

    const uiByPluginAndFile = new Map();
    const uiByFileBase = new Map();
    for (const ui of uiComponents) {
      const baseName = path.basename(ui.file || `${ui.name}.vue`).toLowerCase();
      uiByPluginAndFile.set(`${ui.plugin}::${baseName}`, ui.component_id);
      if (!uiByFileBase.has(baseName)) uiByFileBase.set(baseName, []);
      uiByFileBase.get(baseName).push(ui.component_id);
    }

    const endpointLinks = [];
    const uiLinks = [];
    const missingTargets = [];

    for (const st of userStories) {
      const plugin = domainPluginMap.get(st.domain_id) || null;

      for (const rawEp of (st.target_endpoints || [])) {
        const candidate = STORY_ENDPOINT_ALIASES[rawEp.trim()] || rawEp.trim();
        let resolvedId = null;
        if (epExact.has(candidate)) resolvedId = candidate;
        else {
          const norm = normalizeParamPath(candidate);
          if (epByNorm.has(norm)) resolvedId = epByNorm.get(norm);
        }
        if (resolvedId) {
          endpointLinks.push({
            story_id: st.story_id,
            feature_id: st.feature_id,
            endpoint_id: resolvedId,
            raw_target: rawEp.trim()
          });
        } else {
          missingTargets.push({ story_id: st.story_id, target_type: 'ApiEndpoint', raw_target: rawEp });
        }
      }

      for (const rawUi of (st.target_ui_components || [])) {
        const candidate = (STORY_UI_ALIASES[rawUi.trim()] || rawUi.trim()).toLowerCase();
        let resolvedCid = plugin ? uiByPluginAndFile.get(`${plugin}::${candidate}`) : null;
        if (!resolvedCid && uiByFileBase.has(candidate)) {
          const matches = uiByFileBase.get(candidate);
          if (matches.length === 1) resolvedCid = matches[0];
        }
        if (resolvedCid) {
          uiLinks.push({
            story_id: st.story_id,
            component_id: resolvedCid,
            raw_target: rawUi.trim()
          });
        } else {
          missingTargets.push({ story_id: st.story_id, target_type: 'UIComponent', raw_target: rawUi });
        }
      }
    }

    return { endpointLinks, uiLinks, missingTargets };
  }

  loadAllTestSuites() {
    const testStrategyDir = path.join(this.baselineDir, '04_Test_Strategy');
    
    const read = file => {
      const p = path.join(testStrategyDir, file);
      return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
    };

    return {
      unit_tests: read('unit_tests.json'),
      api_tests: read('api_tests.json'),
      functional_tests: read('functional_tests.json'),
      ui_component_tests: read('ui_component_tests.json'),
      workflow_state_tests: read('workflow_state_tests.json'),
      security_tests: read('security_tests.json'),
      data_integrity_tests: read('data_integrity_tests.json'),
      file_upload_tests: read('file_upload_tests.json'),
      integration_adapter_tests: read('integration_adapter_tests.json'),
      e2e_tests: read('e2e_tests.json'),
      i18n_accessibility_tests: read('i18n_accessibility_tests.json'),
      performance_tests: read('performance_tests.json')
    };
  }
}

module.exports = GlobalSpecExtractor;
module.exports.resolveRequirementAlias = resolveRequirementAlias;
module.exports.normalizeParamPath = normalizeParamPath;
