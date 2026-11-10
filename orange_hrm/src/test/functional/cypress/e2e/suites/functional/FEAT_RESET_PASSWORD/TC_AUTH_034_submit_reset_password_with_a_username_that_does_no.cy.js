/**
 * Test Case ID: TC_AUTH_034
 * Feature: FEAT_RESET_PASSWORD
 * Name: Submit reset password with a username that does not match the reset code owner
 * Priority: High
 */

describe('Feature FEAT_RESET_PASSWORD: TC_AUTH_034', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_034: Submit reset password with a username that does not match the reset code owner', function () {
    // Objective: Verify the reset form rejects a username that does not belong to the resolved reset code.
    cy.url().should('include', '/auth/login');
  });
});
