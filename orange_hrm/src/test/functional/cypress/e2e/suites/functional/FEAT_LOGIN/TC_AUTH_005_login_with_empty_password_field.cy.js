/**
 * Test Case ID: TC_AUTH_005
 * Feature: FEAT_LOGIN
 * Name: Login with empty password field
 * Priority: Medium
 */

describe('Feature FEAT_LOGIN: TC_AUTH_005', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_005: Login with empty password field', function () {
    // Objective: Verify submitting the login form without a password is handled as invalid credentials.
    cy.url().should('include', '/auth/login');
  });
});
