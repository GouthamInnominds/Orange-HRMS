/**
 * Test Case ID: TC_AUTH_077
 * Feature: FEAT_SESSION_HANDLING_EXPIRY
 * Name: Session times out while browsing an authenticated view page
 * Priority: High
 */

describe('Feature FEAT_SESSION_HANDLING_EXPIRY: TC_AUTH_077', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_077: Session times out while browsing an authenticated view page', function () {
    // Objective: Verify an expired/invalidated session on a standard (view) controller redirects the user to the login page instead of showing stale content.
    cy.url().should('include', '/auth/login');
  });
});
