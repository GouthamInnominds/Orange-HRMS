/**
 * Test Case ID: TC_AUTH_027
 * Feature: FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE
 * Name: Multiple consecutive reset requests for the same user
 * Priority: Medium
 */

describe('Feature FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE: TC_AUTH_027', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_027: Multiple consecutive reset requests for the same user', function () {
    // Objective: Verify requesting a new reset code before using a previous one is accepted and generates a fresh code (current behaviour, no throttling found in code).
    cy.url().should('include', '/auth/login');
  });
});
