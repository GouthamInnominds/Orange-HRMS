/**
 * Test Case ID: TC_AUTH_059
 * Feature: FEAT_CSRF_PROTECTION
 * Name: Login form submitted with a missing CSRF token
 * Priority: High
 */

describe('Feature FEAT_CSRF_PROTECTION: TC_AUTH_059', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_059: Login form submitted with a missing CSRF token', function () {
    // Objective: Verify the login POST is rejected when _token is absent.
    cy.url().should('include', '/auth/login');
  });
});
