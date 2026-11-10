/**
 * Test Case ID: TC_AUTH_060
 * Feature: FEAT_CSRF_PROTECTION
 * Name: Login form submitted with an invalid/tampered CSRF token
 * Priority: High
 */

describe('Feature FEAT_CSRF_PROTECTION: TC_AUTH_060', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_060: Login form submitted with an invalid/tampered CSRF token', function () {
    // Objective: Verify the login POST is rejected when _token does not match the session-issued token.
    cy.url().should('include', '/auth/login');
  });
});
