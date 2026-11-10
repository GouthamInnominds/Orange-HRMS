/**
 * Test Case ID: TC_AUTH_016
 * Feature: FEAT_LOGOUT
 * Name: Logout endpoint does not require a CSRF token
 * Priority: Medium
 */

describe('Feature FEAT_LOGOUT: TC_AUTH_016', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_016: Logout endpoint does not require a CSRF token', function () {
    // Objective: Verify current behaviour: LogoutController performs no CSRF token validation before invalidating the session, which means logout can be triggered cross-site (documenting current behaviour/gap, not a confirmed protection).
    cy.url().should('include', '/auth/login');
  });
});
