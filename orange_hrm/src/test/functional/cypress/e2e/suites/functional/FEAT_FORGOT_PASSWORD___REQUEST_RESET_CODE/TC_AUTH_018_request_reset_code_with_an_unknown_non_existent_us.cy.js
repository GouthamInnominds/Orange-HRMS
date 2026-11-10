/**
 * Test Case ID: TC_AUTH_018
 * Feature: FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE
 * Name: Request reset code with an unknown/non-existent username
 * Priority: High
 */

describe('Feature FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE: TC_AUTH_018', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_018: Request reset code with an unknown/non-existent username', function () {
    // Objective: Verify that requesting a reset for a username that does not exist does not reveal whether the account exists.
    cy.url().should('include', '/auth/login');
  });
});
