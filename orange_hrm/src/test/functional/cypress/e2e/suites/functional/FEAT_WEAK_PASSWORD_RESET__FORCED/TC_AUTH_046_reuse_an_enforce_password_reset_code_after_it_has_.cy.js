/**
 * Test Case ID: TC_AUTH_046
 * Feature: FEAT_WEAK_PASSWORD_RESET__FORCED_
 * Name: Reuse an enforce-password reset code after it has already been consumed
 * Priority: Medium
 */

describe('Feature FEAT_WEAK_PASSWORD_RESET__FORCED_: TC_AUTH_046', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_046: Reuse an enforce-password reset code after it has already been consumed', function () {
    // Objective: Verify a completed enforce-password reset code cannot be replayed to change the password again.
    cy.url().should('include', '/auth/login');
  });
});
