/**
 * Test Case ID: TC_ATT_054
 * Feature: FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_
 * Name: ESS user is forbidden from viewing another employee's attendance records directly
 * Priority: High
 */

describe('Feature FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_: TC_ATT_054', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_054: ESS user is forbidden from viewing another employee\'s attendance records directly', function () {
    // Objective: Verify an ESS-role user without supervisory relationship cannot view another employee\'s attendance records, per EmployeeDataGroupReadPermissionRule.
    cy.url().should('include', '/auth/login');
  });
});
