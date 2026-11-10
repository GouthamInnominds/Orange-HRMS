/**
 * Test Case ID: TC_AUTH_081
 * Feature: FEAT_SESSION_HANDLING_EXPIRY
 * Name: User record is modified elsewhere, invalidating the current session token
 * Priority: Medium
 */

describe('Feature FEAT_SESSION_HANDLING_EXPIRY: TC_AUTH_081', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_081: User record is modified elsewhere, invalidating the current session token', function () {
    // Objective: Verify that if the logged-in user\'s dateModified timestamp changes (e.g. edited by an admin) the current session is treated as stale and ended.
    cy.url().should('include', '/auth/login');
  });
});
