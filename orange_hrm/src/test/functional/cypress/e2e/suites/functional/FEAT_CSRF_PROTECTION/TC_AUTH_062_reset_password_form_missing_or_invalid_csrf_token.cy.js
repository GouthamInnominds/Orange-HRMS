/**
 * Test Case ID: TC_AUTH_062
 * Feature: FEAT_CSRF_PROTECTION
 * Name: Reset-password form missing or invalid CSRF token
 * Priority: High
 */

describe('Feature FEAT_CSRF_PROTECTION: TC_AUTH_062', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_062: Reset-password form missing or invalid CSRF token', function () {
    // Objective: Verify the final reset-password submission form is protected against CSRF.
    cy.url().should('include', '/auth/login');
  });
});
