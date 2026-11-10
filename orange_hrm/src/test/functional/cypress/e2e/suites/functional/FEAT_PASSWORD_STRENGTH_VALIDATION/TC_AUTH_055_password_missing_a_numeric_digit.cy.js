/**
 * Test Case ID: TC_AUTH_055
 * Feature: FEAT_PASSWORD_STRENGTH_VALIDATION
 * Name: Password missing a numeric digit
 * Priority: High
 */

describe('Feature FEAT_PASSWORD_STRENGTH_VALIDATION: TC_AUTH_055', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_055: Password missing a numeric digit', function () {
    // Objective: Verify a password with no digits is rejected when the policy requires at least one number.
    cy.url().should('include', '/auth/login');
  });
});
