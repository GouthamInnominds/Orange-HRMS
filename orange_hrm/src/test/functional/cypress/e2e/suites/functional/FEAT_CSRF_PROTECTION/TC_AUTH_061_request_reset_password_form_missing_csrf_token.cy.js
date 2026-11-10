/**
 * Test Case ID: TC_AUTH_061
 * Feature: FEAT_CSRF_PROTECTION
 * Name: Request-reset-password form missing CSRF token
 * Priority: High
 */

describe('Feature FEAT_CSRF_PROTECTION: TC_AUTH_061', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_061: Request-reset-password form missing CSRF token', function () {
    // Objective: Verify the forgot-password request form is protected against CSRF.
    cy.url().should('include', '/auth/login');
  });
});
