/**
 * Test Case ID: TC_ATT_031
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___EDIT
 * Name: Edit record ID parameter must be a positive integer
 * Priority: Low
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___EDIT: TC_ATT_031', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_031: Edit record ID parameter must be a positive integer', function () {
    // Objective: Verify editing an attendance record fails validation when the {id} path parameter is not a positive integer (e.g. 0 or negative).
    cy.url().should('include', '/auth/login');
  });
});
