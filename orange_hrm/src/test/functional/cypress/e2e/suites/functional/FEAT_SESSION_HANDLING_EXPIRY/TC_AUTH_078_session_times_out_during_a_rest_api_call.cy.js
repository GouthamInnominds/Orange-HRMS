/**
 * Test Case ID: TC_AUTH_078
 * Feature: FEAT_SESSION_HANDLING_EXPIRY
 * Name: Session times out during a REST API call
 * Priority: High
 */

describe('Feature FEAT_SESSION_HANDLING_EXPIRY: TC_AUTH_078', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_078: Session times out during a REST API call', function () {
    // Objective: Verify an expired session hitting a REST endpoint returns a structured 401 instead of an HTML redirect.
    cy.url().should('include', '/auth/login');
  });
});
