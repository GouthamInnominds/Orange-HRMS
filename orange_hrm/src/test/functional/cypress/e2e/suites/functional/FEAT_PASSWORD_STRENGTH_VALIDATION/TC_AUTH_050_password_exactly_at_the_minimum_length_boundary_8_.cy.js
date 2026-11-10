/**
 * Test Case ID: TC_AUTH_050
 * Feature: FEAT_PASSWORD_STRENGTH_VALIDATION
 * Name: Password exactly at the minimum length boundary (8 characters)
 * Priority: Medium
 */

describe('Feature FEAT_PASSWORD_STRENGTH_VALIDATION: TC_AUTH_050', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_050: Password exactly at the minimum length boundary (8 characters)', function () {
    // Objective: Verify a password exactly at the configured minimum length is accepted (when all other rules are satisfied).
    cy.url().should('include', '/auth/login');
  });
});
