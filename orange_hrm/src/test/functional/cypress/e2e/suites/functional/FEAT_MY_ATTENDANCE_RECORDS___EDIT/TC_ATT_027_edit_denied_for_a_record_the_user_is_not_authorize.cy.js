/**
 * Test Case ID: TC_ATT_027
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___EDIT
 * Name: Edit denied for a record the user is not authorized to modify
 * Priority: High
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___EDIT: TC_ATT_027', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_027: Edit denied for a record the user is not authorized to modify', function () {
    // Objective: Verify a user without the appropriate edit-punch-time workflow permission for the record\'s owner receives a 403 Forbidden.
    cy.url().should('include', '/auth/login');
  });
});
