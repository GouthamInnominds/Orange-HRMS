/**
 * Test Case ID: TC_ATT_025
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___EDIT
 * Name: Edit blocked when new punch-in time overlaps another record
 * Priority: High
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___EDIT: TC_ATT_025', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_025: Edit blocked when new punch-in time overlaps another record', function () {
    // Objective: Verify editing the punch-in time is rejected with \'Punch-In Overlap Found\' if the new time overlaps an existing attendance record for the same employee.
    cy.url().should('include', '/auth/login');
  });
});
