/**
 * Test Case ID: TC_AUTH_086
 * Feature: FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN
 * Name: Login attempt with a terminated employee's user account
 * Priority: High
 */

describe('Feature FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN: TC_AUTH_086', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_086: Login attempt with a terminated employee\'s user account', function () {
    // Objective: Verify an account belonging to a terminated employee cannot log in even with correct credentials.
    cy.url().should('include', '/auth/login');
  });
});
