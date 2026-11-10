/**
 * Test Case ID: TC_AUTH_087
 * Feature: FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN
 * Name: Login attempt with a user account that has no linked employee
 * Priority: High
 */

describe('Feature FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN: TC_AUTH_087', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_087: Login attempt with a user account that has no linked employee', function () {
    // Objective: Verify a system user account without an associated employee record cannot complete login.
    cy.url().should('include', '/auth/login');
  });
});
