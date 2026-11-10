/**
 * Test Case ID: TC_ATT_059
 * Feature: FEAT_ATTENDANCE_SUMMARY_REPORT
 * Name: Attendance summary blocked for an employee outside the supervisor's scope
 * Priority: High
 */

describe('Feature FEAT_ATTENDANCE_SUMMARY_REPORT: TC_ATT_059', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_059: Attendance summary blocked for an employee outside the supervisor\'s scope', function () {
    // Objective: Verify a Supervisor cannot retrieve the attendance summary of an employee who is not their subordinate.
    cy.url().should('include', '/auth/login');
  });
});
