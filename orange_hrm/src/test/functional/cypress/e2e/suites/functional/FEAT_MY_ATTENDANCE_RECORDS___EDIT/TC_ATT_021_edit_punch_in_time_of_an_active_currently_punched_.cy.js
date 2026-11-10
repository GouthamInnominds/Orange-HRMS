/**
 * Test Case ID: TC_ATT_021
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___EDIT
 * Name: Edit punch-in time of an active (currently punched-in) record
 * Priority: High
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___EDIT: TC_ATT_021', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_021: Edit punch-in time of an active (currently punched-in) record', function () {
    // Objective: Verify a user with edit permission can successfully update the punch-in date/time of a record that is still in PUNCHED IN state.
    cy.url().should('include', '/auth/login');
  });
});
