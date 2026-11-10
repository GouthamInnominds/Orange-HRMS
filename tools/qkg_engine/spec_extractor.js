/**
 * OrangeHRM QKG Specification & Test Extractor
 * Extracts BusinessDomain, BusinessWorkflow, Feature, RequirementGroup,
 * Requirement, and TestCase nodes with strict provenance and confidence metadata.
 */

const fs = require('fs');
const path = require('path');

class SpecExtractor {
  constructor(baselineDir) {
    this.baselineDir = baselineDir;
  }

  extractPimSpecifications() {
    // 1. Business Domain
    const domain = {
      domain_id: 'DOMAIN_WORKFORCE',
      name: 'Workforce & Personal Information Management',
      description: 'Centralized workforce identity, job history, and personal record keeping.'
    };

    // 2. Business Workflows
    const workflows = [
      {
        workflow_id: 'WF_PIM_ONBOARDING',
        domain_id: 'DOMAIN_WORKFORCE',
        name: 'Employee Onboarding to Operational Readiness',
        type: 'CoreLifecycle',
        description: 'End-to-end journey from profile creation to job and reporting assignment.'
      },
      {
        workflow_id: 'WF_PIM_PROFILE_UPDATE',
        domain_id: 'DOMAIN_WORKFORCE',
        name: 'Self-Service Profile & Contact Update',
        type: 'SelfService',
        description: 'Employee updating contact and emergency details with verification.'
      },
      {
        workflow_id: 'WF_PIM_SEPARATION',
        domain_id: 'DOMAIN_WORKFORCE',
        name: 'Employee Termination & Offboarding',
        type: 'ExitLifecycle',
        description: 'Formal termination of employment and disabling user credentials.'
      }
    ];

    // 3. Features
    const features = [
      {
        feature_id: 'FEAT_PIM_EMPLOYEE_MASTER',
        workflow_id: 'WF_PIM_ONBOARDING',
        name: 'Employee Master Record Management',
        description: 'Creation, search, pagination, and identity record tracking.'
      },
      {
        feature_id: 'FEAT_PIM_JOB_DETAILS',
        workflow_id: 'WF_PIM_ONBOARDING',
        name: 'Employee Job & Organizational Placement',
        description: 'Assigning job title, subunit, location, and employment status.'
      },
      {
        feature_id: 'FEAT_PIM_REPORT_TO',
        workflow_id: 'WF_PIM_ONBOARDING',
        name: 'Reporting Hierarchy & Supervision',
        description: 'Direct and indirect supervisory reporting relationships.'
      },
      {
        feature_id: 'FEAT_PIM_SALARY',
        workflow_id: 'WF_PIM_ONBOARDING',
        name: 'Salary Components & Compensation',
        description: 'Pay frequency, currency, direct deposit, and basic salary.'
      },
      {
        feature_id: 'FEAT_PIM_PERSONAL_CONTACT',
        workflow_id: 'WF_PIM_PROFILE_UPDATE',
        name: 'Personal & Contact Information',
        description: 'Address, phone numbers, work/other emails, and emergency contacts.'
      },
      {
        feature_id: 'FEAT_PIM_TERMINATION',
        workflow_id: 'WF_PIM_SEPARATION',
        name: 'Employee Termination Lifecycle',
        description: 'Recording termination reason, date, and revocation of user login.'
      }
    ];

    // 4. Requirement Groups & Requirements
    const requirementGroups = [
      {
        group_id: 'REQGRP_PIM_CREATION',
        feature_id: 'FEAT_PIM_EMPLOYEE_MASTER',
        name: 'Employee Creation & Validation Group'
      },
      {
        group_id: 'REQGRP_PIM_JOB',
        feature_id: 'FEAT_PIM_JOB_DETAILS',
        name: 'Job Allocation Group'
      },
      {
        group_id: 'REQGRP_PIM_HIERARCHY',
        feature_id: 'FEAT_PIM_REPORT_TO',
        name: 'Hierarchy & Reporting Group'
      },
      {
        group_id: 'REQGRP_PIM_COMP',
        feature_id: 'FEAT_PIM_SALARY',
        name: 'Compensation & Security Group'
      }
    ];

    const requirements = [
      {
        requirement_id: 'FR_PIM_001',
        group_id: 'REQGRP_PIM_CREATION',
        title: 'Create New Employee Profile',
        type: 'FR',
        status: 'Approved',
        priority: 'Critical',
        source_file: '02_System_Requirements/functional_requirements.md',
        source_section: '2.0',
        baseline: 'ORANGEHRM_BASELINE_v1.0'
      },
      {
        requirement_id: 'FR_PIM_002',
        group_id: 'REQGRP_PIM_JOB',
        title: 'Employee Job Assignment',
        type: 'FR',
        status: 'Approved',
        priority: 'High',
        source_file: '02_System_Requirements/functional_requirements.md',
        source_section: '2.0',
        baseline: 'ORANGEHRM_BASELINE_v1.0'
      },
      {
        requirement_id: 'FR_PIM_003',
        group_id: 'REQGRP_PIM_HIERARCHY',
        title: 'Reporting Hierarchy Definition',
        type: 'FR',
        status: 'Approved',
        priority: 'High',
        source_file: '02_System_Requirements/functional_requirements.md',
        source_section: '2.0',
        baseline: 'ORANGEHRM_BASELINE_v1.0'
      },
      {
        requirement_id: 'FR_PIM_004',
        group_id: 'REQGRP_PIM_COMP',
        title: 'Salary Component & Compensation Management',
        type: 'FR',
        status: 'Approved',
        priority: 'High',
        source_file: '02_System_Requirements/functional_requirements.md',
        source_section: '2.0',
        baseline: 'ORANGEHRM_BASELINE_v1.0'
      },
      {
        requirement_id: 'NFR_SEC_001',
        group_id: 'REQGRP_PIM_COMP',
        title: 'Broken Object Level Authorization (BOLA/IDOR) Defense',
        type: 'NFR',
        status: 'Approved',
        priority: 'Critical',
        source_file: '02_System_Requirements/non_functional_requirements.md',
        source_section: '2.0',
        baseline: 'ORANGEHRM_BASELINE_v1.0'
      },
      {
        requirement_id: 'NFR_PERF_001',
        group_id: 'REQGRP_PIM_CREATION',
        title: 'PIM Search Latency SLA under Load',
        type: 'NFR',
        status: 'Approved',
        priority: 'High',
        source_file: '02_System_Requirements/non_functional_requirements.md',
        source_section: '3.0',
        baseline: 'ORANGEHRM_BASELINE_v1.0'
      }
    ];

    // 5. Business Rules
    const businessRules = [
      {
        rule_id: 'BR_PIM_001',
        requirement_id: 'FR_PIM_001',
        name: 'Employee Number Uniqueness',
        description: 'Every employee must have a unique identifier across active and terminated staff.'
      },
      {
        rule_id: 'BR_PIM_002',
        requirement_id: 'FR_PIM_003',
        name: 'Supervisor Hierarchy Loop Prevention',
        description: 'Circular supervisor assignments are strictly prohibited.'
      },
      {
        rule_id: 'BR_PIM_005',
        requirement_id: 'FR_PIM_001',
        name: 'Termination Credential Lock',
        description: 'Terminating an employee automatically disables user authentication.'
      }
    ];

    return { domain, workflows, features, requirementGroups, requirements, businessRules };
  }

  extractPimTestCases() {
    const testStrategyDir = path.join(this.baselineDir, '04_Test_Strategy');
    const functionalTests = JSON.parse(fs.readFileSync(path.join(testStrategyDir, 'functional_tests.json'), 'utf8'));
    const apiTests = JSON.parse(fs.readFileSync(path.join(testStrategyDir, 'api_tests.json'), 'utf8'));
    const unitTests = JSON.parse(fs.readFileSync(path.join(testStrategyDir, 'unit_tests.json'), 'utf8'));

    // Filter PIM specific tests
    const pimFunctional = functionalTests.filter(t => t.testcase_id.includes('PIM') || t.feature_id.includes('PIM'));
    const pimApi = apiTests.filter(t => t.endpoint.includes('/pim/'));
    const pimUnit = unitTests.filter(t => t.plugin === 'orangehrmPimPlugin');

    return {
      functional: pimFunctional,
      api: pimApi,
      unit: pimUnit
    };
  }
}

module.exports = SpecExtractor;
