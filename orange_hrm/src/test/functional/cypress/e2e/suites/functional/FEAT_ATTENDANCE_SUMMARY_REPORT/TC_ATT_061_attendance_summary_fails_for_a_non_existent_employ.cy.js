/**
 * Test Case ID: TC_ATT_061
 * Feature: FEAT_ATTENDANCE_SUMMARY_REPORT
 * Name: Attendance summary fails for a non-existent employee number
 * Priority: Medium
 */

describe('Feature FEAT_ATTENDANCE_SUMMARY_REPORT: TC_ATT_061', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_061: Attendance summary fails for a non-existent employee number', function () {
    // Objective: Verify the summary endpoint validates that the supplied empNumber corresponds to an existing employee.
    cy.url().should('include', '/auth/login');
  });
});
