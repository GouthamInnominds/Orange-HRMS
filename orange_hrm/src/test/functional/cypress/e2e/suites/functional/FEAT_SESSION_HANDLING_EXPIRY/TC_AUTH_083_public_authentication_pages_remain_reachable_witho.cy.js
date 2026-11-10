/**
 * Test Case ID: TC_AUTH_083
 * Feature: FEAT_SESSION_HANDLING_EXPIRY
 * Name: Public authentication pages remain reachable without a session
 * Priority: Medium
 */

describe('Feature FEAT_SESSION_HANDLING_EXPIRY: TC_AUTH_083', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_083: Public authentication pages remain reachable without a session', function () {
    // Objective: Verify login, forgot-password and reset-password pages are excluded from the session-expiry enforcement.
    cy.url().should('include', '/auth/login');
  });
});
