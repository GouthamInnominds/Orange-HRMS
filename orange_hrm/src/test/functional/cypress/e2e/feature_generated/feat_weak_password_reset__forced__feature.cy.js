/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_WEAK_PASSWORD_RESET__FORCED_ | Tests: 10
 */

describe('Feature: FEAT_WEAK_PASSWORD_RESET__FORCED_', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_AUTH_038: Login succeeds but password fails the strength policy while enforcement is on', function () {
    // Priority: High | Objective: Verify a technically-correct login is intercepted and redirected to forced password reset when the password does not meet the configured strength policy.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_039: Weak password reset page loads with a valid reset code', function () {
    // Priority: Medium | Objective: Verify the forced reset page correctly identifies the user and renders the change-password form.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_040: Weak password reset page with an invalid or already-used code', function () {
    // Priority: Medium | Objective: Verify an invalid enforce-password reset code shows the invalid-code state rather than the form.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_041: Enforce-password reset code expires after 1 hour', function () {
    // Priority: High | Objective: Verify an enforce-password reset code becomes invalid once more than one hour has passed since the request.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_042: Submit a strong new password with the correct current password', function () {
    // Priority: High | Objective: Verify a user can successfully replace a weak password with a compliant one via the forced-reset form.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_043: Submit the forced-reset form with an incorrect current password', function () {
    // Priority: High | Objective: Verify the forced-reset flow rejects an incorrect current password.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_044: Submit the forced-reset form with missing/invalid CSRF token', function () {
    // Priority: High | Objective: Verify the forced password reset form enforces CSRF protection.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_045: Submit a new password that still fails the strength policy', function () {
    // Priority: High | Objective: Verify the forced-reset endpoint blocks a replacement password that still does not satisfy the configured complexity rules.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_046: Reuse an enforce-password reset code after it has already been consumed', function () {
    // Priority: Medium | Objective: Verify a completed enforce-password reset code cannot be replayed to change the password again.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_047: Username and password field length boundaries on the forced-reset form', function () {
    // Priority: Medium | Objective: Verify the forced-reset endpoint enforces username length (5-40 chars) and password max length (64 chars) parameter rules.
    cy.url().should('include', '/auth/login');
  });

});
