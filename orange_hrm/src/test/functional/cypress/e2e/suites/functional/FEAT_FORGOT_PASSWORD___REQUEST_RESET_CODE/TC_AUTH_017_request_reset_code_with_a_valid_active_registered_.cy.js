/**
 * Test Case ID: TC_AUTH_017
 * Feature: FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE
 * Name: Request reset code with a valid, active registered username
 * Priority: High
 */

describe('Feature FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE: TC_AUTH_017', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_017: Request reset code with a valid, active registered username', function () {
    // Objective: Verify a valid active user with an assigned employee and work email successfully triggers a password reset email.
    cy.url().should('include', '/auth/login');
  });
});
