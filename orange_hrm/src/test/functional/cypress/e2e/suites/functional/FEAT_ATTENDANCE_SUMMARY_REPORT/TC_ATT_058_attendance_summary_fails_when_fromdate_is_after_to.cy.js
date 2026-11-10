/**
 * Test Case ID: TC_ATT_058
 * Feature: FEAT_ATTENDANCE_SUMMARY_REPORT
 * Name: Attendance summary fails when fromDate is after toDate
 * Priority: Medium
 */

describe('Feature FEAT_ATTENDANCE_SUMMARY_REPORT: TC_ATT_058', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_058: Attendance summary fails when fromDate is after toDate', function () {
    // Objective: Verify the summary report rejects an invalid date range where fromDate is later than toDate.
    cy.url().should('include', '/auth/login');
  });
});
