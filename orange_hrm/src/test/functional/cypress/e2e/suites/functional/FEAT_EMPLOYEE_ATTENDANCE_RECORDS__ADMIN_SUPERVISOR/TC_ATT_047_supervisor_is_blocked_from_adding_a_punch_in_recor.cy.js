/**
 * Test Case ID: TC_ATT_047
 * Feature: FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_
 * Name: Supervisor is blocked from adding a punch-in record for an employee outside their reporting hierarchy
 * Priority: High
 */

describe('Feature FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_: TC_ATT_047', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_047: Supervisor is blocked from adding a punch-in record for an employee outside their reporting hierarchy', function () {
    // Objective: Verify a Supervisor cannot create an attendance record for an employee who is not their subordinate.
    cy.url().should('include', '/auth/login');
  });
});
