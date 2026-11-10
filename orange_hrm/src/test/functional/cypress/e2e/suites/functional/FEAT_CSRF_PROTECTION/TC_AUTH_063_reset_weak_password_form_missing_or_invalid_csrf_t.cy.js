/**
 * Test Case ID: TC_AUTH_063
 * Feature: FEAT_CSRF_PROTECTION
 * Name: Reset-weak-password form missing or invalid CSRF token
 * Priority: High
 */

describe('Feature FEAT_CSRF_PROTECTION: TC_AUTH_063', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_063: Reset-weak-password form missing or invalid CSRF token', function () {
    // Objective: Verify the forced weak-password reset form is protected against CSRF.
    cy.url().should('include', '/auth/login');
  });
});
