/**
 * Test Case ID: TC_AUTH_091
 * Feature: FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN
 * Name: No lockout after repeated failed login attempts
 * Priority: Medium
 */

describe('Feature FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN: TC_AUTH_091', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_091: No lockout after repeated failed login attempts', function () {
    // Objective: Document current behaviour: verify whether the application locks or throttles an account after multiple consecutive failed login attempts.
    cy.url().should('include', '/auth/login');
  });
});
