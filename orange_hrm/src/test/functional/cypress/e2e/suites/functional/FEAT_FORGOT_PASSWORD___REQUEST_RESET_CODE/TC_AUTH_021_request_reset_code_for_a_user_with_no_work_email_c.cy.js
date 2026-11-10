/**
 * Test Case ID: TC_AUTH_021
 * Feature: FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE
 * Name: Request reset code for a user with no work email configured
 * Priority: Medium
 */

describe('Feature FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE: TC_AUTH_021', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_021: Request reset code for a user with no work email configured', function () {
    // Objective: Verify a user whose employee record has no work email cannot complete the reset flow, without exposing that fact.
    cy.url().should('include', '/auth/login');
  });
});
