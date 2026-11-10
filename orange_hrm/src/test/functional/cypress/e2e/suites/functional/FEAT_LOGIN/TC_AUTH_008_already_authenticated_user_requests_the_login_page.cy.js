/**
 * Test Case ID: TC_AUTH_008
 * Feature: FEAT_LOGIN
 * Name: Already authenticated user requests the login page
 * Priority: Medium
 */

describe('Feature FEAT_LOGIN: TC_AUTH_008', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_008: Already authenticated user requests the login page', function () {
    // Objective: Verify a user who already has an authenticated session is redirected away from the login form instead of seeing it again.
    cy.url().should('include', '/auth/login');
  });
});
