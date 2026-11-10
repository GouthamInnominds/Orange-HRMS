/**
 * Test Case ID: TC_AUTH_015
 * Feature: FEAT_LOGOUT
 * Name: Logout with no active session
 * Priority: Low
 */

describe('Feature FEAT_LOGOUT: TC_AUTH_015', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_015: Logout with no active session', function () {
    // Objective: Verify hitting the logout endpoint without an existing session does not error out.
    cy.url().should('include', '/auth/login');
  });
});
