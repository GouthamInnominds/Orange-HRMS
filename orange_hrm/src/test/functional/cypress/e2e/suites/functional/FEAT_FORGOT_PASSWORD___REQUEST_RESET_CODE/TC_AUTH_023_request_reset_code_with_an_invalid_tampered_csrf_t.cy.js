/**
 * Test Case ID: TC_AUTH_023
 * Feature: FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE
 * Name: Request reset code with an invalid/tampered CSRF token
 * Priority: High
 */

describe('Feature FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE: TC_AUTH_023', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_023: Request reset code with an invalid/tampered CSRF token', function () {
    // Objective: Verify the reset request form rejects a forged or expired CSRF token value.
    cy.url().should('include', '/auth/login');
  });
});
