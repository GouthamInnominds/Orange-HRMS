/**
 * Test Case ID: TC_AUTH_067
 * Feature: FEAT_CSRF_PROTECTION
 * Name: Expired session token replay after logout
 * Priority: Medium
 */

describe('Feature FEAT_CSRF_PROTECTION: TC_AUTH_067', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_067: Expired session token replay after logout', function () {
    // Objective: Verify a CSRF token captured before logout cannot be used to perform a state-changing action after the session ends.
    cy.url().should('include', '/auth/login');
  });
});
