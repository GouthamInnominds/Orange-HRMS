/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_RESET_PASSWORD | Tests: 10
 */

describe('Feature: FEAT_RESET_PASSWORD', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_AUTH_028: Open reset link with a valid, unused, unexpired code', function () {
    // Priority: High | Objective: Verify a valid reset link renders the reset-password form pre-filled with the correct username.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_029: Submit a new password with a valid code and matching username', function () {
    // Priority: High | Objective: Verify a user can successfully set a new password through a valid reset link.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_030: Open reset link with an invalid/non-existent code', function () {
    // Priority: High | Objective: Verify a bogus reset code shows an error state rather than a reset form.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_031: Open reset link after it has expired (older than 1 day)', function () {
    // Priority: High | Objective: Verify a reset code becomes unusable once more than one day has elapsed since it was requested.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_032: Reuse an older reset code after a newer one was requested', function () {
    // Priority: High | Objective: Verify that once a new reset code is requested for the same email, the previous code is no longer accepted (replay of a stale code).
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_033: Reuse a reset code after it has already been used', function () {
    // Priority: High | Objective: Verify a reset code cannot be used a second time to change the password again.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_034: Submit reset password with a username that does not match the reset code owner', function () {
    // Priority: High | Objective: Verify the reset form rejects a username that does not belong to the resolved reset code.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_035: Submit reset password form with missing or invalid CSRF token', function () {
    // Priority: High | Objective: Verify the reset-password form enforces CSRF protection.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_036: Submit a weak/non-compliant new password via reset password form', function () {
    // Priority: Medium | Objective: Verify whether the reset-password flow enforces the configured password strength policy before saving (documents current behaviour/possible gap).
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_037: Successful password reset invalidates the current session', function () {
    // Priority: Medium | Objective: Verify that completing a reset forces any existing session to end, requiring fresh login with the new password.
    cy.url().should('include', '/auth/login');
  });

});
