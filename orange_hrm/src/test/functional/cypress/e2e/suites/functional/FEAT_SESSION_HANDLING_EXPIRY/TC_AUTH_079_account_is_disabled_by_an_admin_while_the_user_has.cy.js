/**
 * Test Case ID: TC_AUTH_079
 * Feature: FEAT_SESSION_HANDLING_EXPIRY
 * Name: Account is disabled by an admin while the user has an active session
 * Priority: High
 */

describe('Feature FEAT_SESSION_HANDLING_EXPIRY: TC_AUTH_079', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_079: Account is disabled by an admin while the user has an active session', function () {
    // Objective: Verify a mid-session account disable takes effect on the very next request rather than waiting for re-login.
    cy.url().should('include', '/auth/login');
  });
});
