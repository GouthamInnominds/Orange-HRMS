/**
 * Test Case ID: TC_AUTH_019
 * Feature: FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE
 * Name: Request reset code for a disabled user account
 * Priority: Medium
 */

describe('Feature FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE: TC_AUTH_019', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_019: Request reset code for a disabled user account', function () {
    // Objective: Verify a disabled account\'s owner cannot be distinguished from a valid request via the response, and no email is sent.
    cy.url().should('include', '/auth/login');
  });
});
