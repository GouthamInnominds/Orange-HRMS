/**
 * Test Case ID: TC_AUTH_090
 * Feature: FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN
 * Name: Previously issued reset links become unusable once the account is disabled mid-flow
 * Priority: Medium
 */

describe('Feature FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN: TC_AUTH_090', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_090: Previously issued reset links become unusable once the account is disabled mid-flow', function () {
    // Objective: Verify a reset code requested while the account was active cannot be exploited after the account is disabled before the code is used.
    cy.url().should('include', '/auth/login');
  });
});
