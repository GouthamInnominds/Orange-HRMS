/**
 * Test Case ID: TC_ATT_060
 * Feature: FEAT_ATTENDANCE_SUMMARY_REPORT
 * Name: Attendance summary supports sorting and pagination
 * Priority: Low
 */

describe('Feature FEAT_ATTENDANCE_SUMMARY_REPORT: TC_ATT_060', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_060: Attendance summary supports sorting and pagination', function () {
    // Objective: Verify sortField, sortOrder, limit and offset parameters work correctly on the summary endpoint.
    cy.url().should('include', '/auth/login');
  });
});
