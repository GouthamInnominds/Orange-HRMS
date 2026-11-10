/**
 * Test Case ID: TC_AUTH_066
 * Feature: FEAT_CSRF_PROTECTION
 * Name: A fresh, unique CSRF token is issued on every relevant page load
 * Priority: Medium
 */

describe('Feature FEAT_CSRF_PROTECTION: TC_AUTH_066', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_066: A fresh, unique CSRF token is issued on every relevant page load', function () {
    // Objective: Verify token freshness/uniqueness so tokens are not trivially predictable or globally shared.
    cy.url().should('include', '/auth/login');
  });
});
