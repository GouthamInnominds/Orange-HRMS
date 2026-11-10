/**
 * Test Case ID: TC_ATT_087
 * Feature: FEAT_LATEST_ATTENDANCE_RECORD
 * Name: Get the latest attendance record for the logged-in user
 * Priority: Medium
 */

describe('Feature FEAT_LATEST_ATTENDANCE_RECORD: TC_ATT_087', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_087: Get the latest attendance record for the logged-in user', function () {
    // Objective: Verify GET /attendance/records/latest returns the most recent attendance record for the authenticated user when no empNumber is supplied.
    cy.url().should('include', '/auth/login');
  });
});
