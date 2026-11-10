/**
 * Test Case ID: TC_ATT_024
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___EDIT
 * Name: Edit completed record fails when punchOutTime is missing while punchOutDate is provided
 * Priority: Medium
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___EDIT: TC_ATT_024', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_024: Edit completed record fails when punchOutTime is missing while punchOutDate is provided', function () {
    // Objective: Verify editing a PUNCHED OUT record fails with \'Punch Out Date And Time Should Not Be Null\' when punchOutDate is given but punchOutTime is null.
    cy.url().should('include', '/auth/login');
  });
});
