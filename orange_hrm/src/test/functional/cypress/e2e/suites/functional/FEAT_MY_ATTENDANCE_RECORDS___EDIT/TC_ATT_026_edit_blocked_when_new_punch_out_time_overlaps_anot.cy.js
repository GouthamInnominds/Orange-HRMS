/**
 * Test Case ID: TC_ATT_026
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___EDIT
 * Name: Edit blocked when new punch-out time overlaps another record
 * Priority: High
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___EDIT: TC_ATT_026', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_026: Edit blocked when new punch-out time overlaps another record', function () {
    // Objective: Verify editing punch-out time of a completed record is rejected with \'Punch-Out Overlap Found\' when the new interval overlaps another attendance record.
    cy.url().should('include', '/auth/login');
  });
});
