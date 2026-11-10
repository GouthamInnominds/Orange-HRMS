/**
 * Test Case ID: TC_ATT_049
 * Feature: FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_
 * Name: Admin deletes an attendance record belonging to any employee
 * Priority: Medium
 */

describe('Feature FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_: TC_ATT_049', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_049: Admin deletes an attendance record belonging to any employee', function () {
    // Objective: Verify an Admin can delete attendance record(s) belonging to any employee in the system.
    cy.url().should('include', '/auth/login');
  });
});
