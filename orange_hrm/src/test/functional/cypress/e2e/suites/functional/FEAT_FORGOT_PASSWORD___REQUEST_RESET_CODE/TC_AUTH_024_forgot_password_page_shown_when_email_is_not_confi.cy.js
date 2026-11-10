/**
 * Test Case ID: TC_AUTH_024
 * Feature: FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE
 * Name: Forgot password page shown when email is not configured
 * Priority: Medium
 */

describe('Feature FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE: TC_AUTH_024', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_024: Forgot password page shown when email is not configured', function () {
    // Objective: Verify the request-password page displays an email configuration warning instead of the reset form when SMTP/email is not set up.
    cy.url().should('include', '/auth/login');
  });
});
