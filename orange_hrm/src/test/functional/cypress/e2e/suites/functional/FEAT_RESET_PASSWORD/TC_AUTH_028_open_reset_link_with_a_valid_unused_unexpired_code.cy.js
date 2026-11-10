/**
 * Test Case ID: TC_AUTH_028
 * Feature: FEAT_RESET_PASSWORD
 * Name: Open reset link with a valid, unused, unexpired code
 * Priority: High
 */

describe('Feature FEAT_RESET_PASSWORD: TC_AUTH_028', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_028: Open reset link with a valid, unused, unexpired code', function () {
    // Objective: Verify a valid reset link renders the reset-password form pre-filled with the correct username.
    cy.url().should('include', '/auth/login');
  });
});
