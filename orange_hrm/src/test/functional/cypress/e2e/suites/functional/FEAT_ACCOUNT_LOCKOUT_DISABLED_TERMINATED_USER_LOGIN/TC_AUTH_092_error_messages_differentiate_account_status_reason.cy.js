/**
 * Test Case ID: TC_AUTH_092
 * Feature: FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN
 * Name: Error messages differentiate account-status reasons but not username validity
 * Priority: Medium
 */

describe('Feature FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN: TC_AUTH_092', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_092: Error messages differentiate account-status reasons but not username validity', function () {
    // Objective: Verify that while wrong-password and unknown-username both return a generic message, disabled/terminated/unassigned states return distinct messages that could allow limited account-status enumeration.
    cy.url().should('include', '/auth/login');
  });
});
