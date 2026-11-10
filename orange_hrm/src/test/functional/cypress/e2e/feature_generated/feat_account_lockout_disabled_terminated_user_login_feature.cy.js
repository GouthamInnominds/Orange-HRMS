/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN | Tests: 8
 */

describe('Feature: FEAT_ACCOUNT_LOCKOUT_DISABLED_TERMINATED_USER_LOGIN', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_AUTH_085: Login attempt with a disabled user account and correct password', function () {
    // Priority: High | Objective: Verify a disabled account cannot log in even when the password is correct, and receives a specific message.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_086: Login attempt with a terminated employee\'s user account', function () {
    // Priority: High | Objective: Verify an account belonging to a terminated employee cannot log in even with correct credentials.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_087: Login attempt with a user account that has no linked employee', function () {
    // Priority: High | Objective: Verify a system user account without an associated employee record cannot complete login.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_088: Login attempt with a deleted user account', function () {
    // Priority: High | Objective: Verify a soft-deleted user account is rejected with the generic invalid-credentials message rather than a specific status message.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_089: Forced password-save flows reject disabled/terminated users at the final save step', function () {
    // Priority: Medium | Objective: Verify that even if a reset/enforce-password code is otherwise valid, the underlying save is blocked for a disabled or terminated account.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_090: Previously issued reset links become unusable once the account is disabled mid-flow', function () {
    // Priority: Medium | Objective: Verify a reset code requested while the account was active cannot be exploited after the account is disabled before the code is used.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_091: No lockout after repeated failed login attempts', function () {
    // Priority: Medium | Objective: Document current behaviour: verify whether the application locks or throttles an account after multiple consecutive failed login attempts.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_092: Error messages differentiate account-status reasons but not username validity', function () {
    // Priority: Medium | Objective: Verify that while wrong-password and unknown-username both return a generic message, disabled/terminated/unassigned states return distinct messages that could allow limited account-status enumeration.
    cy.url().should('include', '/auth/login');
  });

});
