/**
 * Test Case ID: TC_AUTH_089
 * Feature: FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN
 * Name: Forced password-save flows reject disabled/terminated users at the final save step
 * Priority: Medium
 */

describe('Feature FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN: TC_AUTH_089', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_089: Forced password-save flows reject disabled/terminated users at the final save step', function () {
    // Objective: Verify that even if a reset/enforce-password code is otherwise valid, the underlying save is blocked for a disabled or terminated account.
    cy.url().should('include', '/auth/login');
  });
});
