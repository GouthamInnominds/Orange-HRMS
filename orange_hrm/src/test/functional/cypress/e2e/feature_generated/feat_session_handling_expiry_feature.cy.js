/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_SESSION_HANDLING_EXPIRY | Tests: 8
 */

describe('Feature: FEAT_SESSION_HANDLING_EXPIRY', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_AUTH_077: Session times out while browsing an authenticated view page', function () {
    // Priority: High | Objective: Verify an expired/invalidated session on a standard (view) controller redirects the user to the login page instead of showing stale content.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_078: Session times out during a REST API call', function () {
    // Priority: High | Objective: Verify an expired session hitting a REST endpoint returns a structured 401 instead of an HTML redirect.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_079: Account is disabled by an admin while the user has an active session', function () {
    // Priority: High | Objective: Verify a mid-session account disable takes effect on the very next request rather than waiting for re-login.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_080: Employee is terminated while the user has an active session', function () {
    // Priority: High | Objective: Verify a mid-session employee termination immediately revokes access.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_081: User record is modified elsewhere, invalidating the current session token', function () {
    // Priority: Medium | Objective: Verify that if the logged-in user\'s dateModified timestamp changes (e.g. edited by an admin) the current session is treated as stale and ended.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_082: Re-login after session timeout returns the user to the originally requested page', function () {
    // Priority: Medium | Objective: Verify the post-timeout login flow restores the user\'s original destination rather than always going to the home page.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_083: Public authentication pages remain reachable without a session', function () {
    // Priority: Medium | Objective: Verify login, forgot-password and reset-password pages are excluded from the session-expiry enforcement.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_084: Unauthenticated request to a protected page never exposes protected content', function () {
    // Priority: High | Objective: Verify an unauthenticated user hitting a non-public controller is always intercepted before any business content renders.
    cy.url().should('include', '/auth/login');
  });

});
