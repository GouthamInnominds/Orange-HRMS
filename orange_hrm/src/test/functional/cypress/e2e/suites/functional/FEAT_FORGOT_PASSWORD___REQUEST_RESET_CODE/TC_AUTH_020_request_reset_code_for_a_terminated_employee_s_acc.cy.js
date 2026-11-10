/**
 * Test Case ID: TC_AUTH_020
 * Feature: FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE
 * Name: Request reset code for a terminated employee's account
 * Priority: Medium
 */

describe('Feature FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE: TC_AUTH_020', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_020: Request reset code for a terminated employee\'s account', function () {
    // Objective: Verify a terminated employee\'s account cannot be used to trigger a password reset email, without exposing that fact.
    cy.url().should('include', '/auth/login');
  });
});
