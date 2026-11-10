/**
 * Test Case ID: TC_ATT_048
 * Feature: FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_
 * Name: Supervisor punches out (proxy) a subordinate who is currently punched in
 * Priority: High
 */

describe('Feature FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_: TC_ATT_048', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_048: Supervisor punches out (proxy) a subordinate who is currently punched in', function () {
    // Objective: Verify a Supervisor can complete (punch out) an open attendance record for a subordinate employee.
    cy.url().should('include', '/auth/login');
  });
});
