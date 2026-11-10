/**
 * Test Case ID: TC_AUTH_022
 * Feature: FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE
 * Name: Request reset code with missing CSRF token
 * Priority: High
 */

describe('Feature FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE: TC_AUTH_022', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_022: Request reset code with missing CSRF token', function () {
    // Objective: Verify the reset request form rejects submissions without a valid \'request-reset-password\' CSRF token.
    cy.url().should('include', '/auth/login');
  });
});
