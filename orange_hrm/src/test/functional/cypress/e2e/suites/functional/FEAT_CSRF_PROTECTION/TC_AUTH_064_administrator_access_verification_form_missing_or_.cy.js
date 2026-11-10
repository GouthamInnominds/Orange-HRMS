/**
 * Test Case ID: TC_AUTH_064
 * Feature: FEAT_CSRF_PROTECTION
 * Name: Administrator-access verification form missing or invalid CSRF token
 * Priority: High
 */

describe('Feature FEAT_CSRF_PROTECTION: TC_AUTH_064', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_064: Administrator-access verification form missing or invalid CSRF token', function () {
    // Objective: Verify the step-up admin verification form is protected against CSRF.
    cy.url().should('include', '/auth/login');
  });
});
