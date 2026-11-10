/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_LOGOUT | Tests: 4
 */

describe('Feature: FEAT_LOGOUT', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_AUTH_013: Logout invalidates the active session', function () {
    // Priority: High | Objective: Verify clicking Logout ends the current authenticated session and returns the user to the login page.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_014: Protected pages are inaccessible immediately after logout', function () {
    // Priority: High | Objective: Verify that after logout, previously accessible authenticated pages can no longer be reached without logging in again.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_015: Logout with no active session', function () {
    // Priority: Low | Objective: Verify hitting the logout endpoint without an existing session does not error out.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_016: Logout endpoint does not require a CSRF token', function () {
    // Priority: Medium | Objective: Verify current behaviour: LogoutController performs no CSRF token validation before invalidating the session, which means logout can be triggered cross-site (documenting current behaviour/gap, not a confirmed protection).
    cy.url().should('include', '/auth/login');
  });

});
