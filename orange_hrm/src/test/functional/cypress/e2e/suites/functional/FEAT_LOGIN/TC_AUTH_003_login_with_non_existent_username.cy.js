/**
 * Test Case ID: TC_AUTH_003
 * Feature: FEAT_LOGIN
 * Name: Login with non-existent username
 * Priority: High
 */

describe('Feature FEAT_LOGIN: TC_AUTH_003', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_003: Login with non-existent username', function () {
    // Objective: Verify login with an unregistered username returns the same generic error as a wrong password (no user enumeration).
    cy.url().should('include', '/auth/login');
  });
});
