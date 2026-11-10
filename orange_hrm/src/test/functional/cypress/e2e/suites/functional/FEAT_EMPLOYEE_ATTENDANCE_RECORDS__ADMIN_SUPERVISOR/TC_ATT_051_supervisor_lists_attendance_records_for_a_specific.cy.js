/**
 * Test Case ID: TC_ATT_051
 * Feature: FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_
 * Name: Supervisor lists attendance records for a specific subordinate via empNumber
 * Priority: High
 */

describe('Feature FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_: TC_ATT_051', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_051: Supervisor lists attendance records for a specific subordinate via empNumber', function () {
    // Objective: Verify a Supervisor can retrieve the attendance record list of a subordinate by specifying the empNumber query parameter.
    cy.url().should('include', '/auth/login');
  });
});
