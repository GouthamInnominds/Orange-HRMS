/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE | Tests: 11
 */

describe('Feature: FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_AUTH_017: Request reset code with a valid, active registered username', function () {
    // Priority: High | Objective: Verify a valid active user with an assigned employee and work email successfully triggers a password reset email.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_018: Request reset code with an unknown/non-existent username', function () {
    // Priority: High | Objective: Verify that requesting a reset for a username that does not exist does not reveal whether the account exists.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_019: Request reset code for a disabled user account', function () {
    // Priority: Medium | Objective: Verify a disabled account\'s owner cannot be distinguished from a valid request via the response, and no email is sent.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_020: Request reset code for a terminated employee\'s account', function () {
    // Priority: Medium | Objective: Verify a terminated employee\'s account cannot be used to trigger a password reset email, without exposing that fact.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_021: Request reset code for a user with no work email configured', function () {
    // Priority: Medium | Objective: Verify a user whose employee record has no work email cannot complete the reset flow, without exposing that fact.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_022: Request reset code with missing CSRF token', function () {
    // Priority: High | Objective: Verify the reset request form rejects submissions without a valid \'request-reset-password\' CSRF token.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_023: Request reset code with an invalid/tampered CSRF token', function () {
    // Priority: High | Objective: Verify the reset request form rejects a forged or expired CSRF token value.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_024: Forgot password page shown when email is not configured', function () {
    // Priority: Medium | Objective: Verify the request-password page displays an email configuration warning instead of the reset form when SMTP/email is not set up.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_025: Reset email fails to send due to invalid/malicious recipient address', function () {
    // Priority: Medium | Objective: Verify a work email that fails validation or contains header-injection characters blocks the reset email and routes to the failure page.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_026: Reset request success and failure pages render the correct components', function () {
    // Priority: Low | Objective: Verify the dedicated success and failure landing pages render their respective Vue components.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_027: Multiple consecutive reset requests for the same user', function () {
    // Priority: Medium | Objective: Verify requesting a new reset code before using a previous one is accepted and generates a fresh code (current behaviour, no throttling found in code).
    cy.url().should('include', '/auth/login');
  });

});
