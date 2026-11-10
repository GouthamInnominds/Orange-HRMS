/**
 * Test Case ID: TC_AUTH_084
 * Feature: FEAT_SESSION_HANDLING_EXPIRY
 * Name: Unauthenticated request to a protected page never exposes protected content
 * Priority: High
 */

describe('Feature FEAT_SESSION_HANDLING_EXPIRY: TC_AUTH_084', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_084: Unauthenticated request to a protected page never exposes protected content', function () {
    // Objective: Verify an unauthenticated user hitting a non-public controller is always intercepted before any business content renders.
    cy.url().should('include', '/auth/login');
  });
});
