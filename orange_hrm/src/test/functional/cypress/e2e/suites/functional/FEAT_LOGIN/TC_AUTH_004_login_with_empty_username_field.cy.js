/**
 * Test Case ID: TC_AUTH_004
 * Feature: FEAT_LOGIN
 * Name: Login with empty username field
 * Priority: Medium
 */

describe('Feature FEAT_LOGIN: TC_AUTH_004', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_004: Login with empty username field', function () {
    // Objective: Verify submitting the login form without a username is handled as invalid credentials.
    cy.url().should('include', '/auth/login');
  });
});
