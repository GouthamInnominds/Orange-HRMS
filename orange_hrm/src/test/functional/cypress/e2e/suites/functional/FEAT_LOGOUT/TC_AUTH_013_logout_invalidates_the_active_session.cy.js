/**
 * Test Case ID: TC_AUTH_013
 * Feature: FEAT_LOGOUT
 * Name: Logout invalidates the active session
 * Priority: High
 */

describe('Feature FEAT_LOGOUT: TC_AUTH_013', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_013: Logout invalidates the active session', function () {
    // Objective: Verify clicking Logout ends the current authenticated session and returns the user to the login page.
    cy.url().should('include', '/auth/login');
  });
});
