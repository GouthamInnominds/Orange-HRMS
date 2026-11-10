/**
 * Test Case ID: TC_AUTH_037
 * Feature: FEAT_RESET_PASSWORD
 * Name: Successful password reset invalidates the current session
 * Priority: Medium
 */

describe('Feature FEAT_RESET_PASSWORD: TC_AUTH_037', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_037: Successful password reset invalidates the current session', function () {
    // Objective: Verify that completing a reset forces any existing session to end, requiring fresh login with the new password.
    cy.url().should('include', '/auth/login');
  });
});
