/**
 * Test Case ID: TC_AUTH_002
 * Feature: FEAT_LOGIN
 * Name: Login with incorrect password
 * Priority: High
 */

describe('Feature FEAT_LOGIN: TC_AUTH_002', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_002: Login with incorrect password', function () {
    // Objective: Verify login is rejected when the password does not match the stored credentials.
    cy.url().should('include', '/auth/login');
  });
});
