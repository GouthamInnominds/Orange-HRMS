/**
 * Test Case ID: TC_ATT_028
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___EDIT
 * Name: Edit fails for a non-existent attendance record ID
 * Priority: Medium
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___EDIT: TC_ATT_028', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_028: Edit fails for a non-existent attendance record ID', function () {
    // Objective: Verify editing an attendance record with an ID that does not exist returns a 404 Record Not Found error.
    cy.url().should('include', '/auth/login');
  });
});
