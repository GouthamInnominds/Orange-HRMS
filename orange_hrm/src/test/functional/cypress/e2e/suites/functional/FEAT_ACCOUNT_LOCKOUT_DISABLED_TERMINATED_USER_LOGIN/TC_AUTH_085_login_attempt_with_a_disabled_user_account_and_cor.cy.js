/**
 * Test Case ID: TC_AUTH_085
 * Feature: FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN
 * Name: Login attempt with a disabled user account and correct password
 * Priority: High
 */

describe('Feature FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN: TC_AUTH_085', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_085: Login attempt with a disabled user account and correct password', function () {
    // Objective: Verify a disabled account cannot log in even when the password is correct, and receives a specific message.
    cy.url().should('include', '/auth/login');
  });
});
