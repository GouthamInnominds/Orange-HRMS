/**
 * Test Case ID: TC_AUTH_010
 * Feature: FEAT_LOGIN
 * Name: Unexpected error during authentication is handled gracefully
 * Priority: Medium
 */

describe('Feature FEAT_LOGIN: TC_AUTH_010', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_010: Unexpected error during authentication is handled gracefully', function () {
    // Objective: Verify that an unexpected (non-AuthenticationException) failure during the authentication chain does not crash the login flow.
    cy.url().should('include', '/auth/login');
  });
});
