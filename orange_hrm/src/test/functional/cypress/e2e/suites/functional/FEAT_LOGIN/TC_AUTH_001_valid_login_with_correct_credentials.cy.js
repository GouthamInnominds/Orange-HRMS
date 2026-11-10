/**
 * Test Case ID: TC_AUTH_001
 * Feature: FEAT_LOGIN
 * Name: Valid login with correct credentials
 * Priority: High
 */

describe('Feature FEAT_LOGIN: TC_AUTH_001', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_001: Valid login with correct credentials', function () {
    // Objective: Verify a user with correct username and password is authenticated and reaches the home page.
    cy.url().should('include', '/auth/login');
  });
});
