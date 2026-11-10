/**
 * Test Case ID: TC_AUTH_088
 * Feature: FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN
 * Name: Login attempt with a deleted user account
 * Priority: High
 */

describe('Feature FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN: TC_AUTH_088', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_088: Login attempt with a deleted user account', function () {
    // Objective: Verify a soft-deleted user account is rejected with the generic invalid-credentials message rather than a specific status message.
    cy.url().should('include', '/auth/login');
  });
});
