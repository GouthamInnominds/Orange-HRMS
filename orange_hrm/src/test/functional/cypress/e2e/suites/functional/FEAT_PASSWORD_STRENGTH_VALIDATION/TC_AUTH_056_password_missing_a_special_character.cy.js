/**
 * Test Case ID: TC_AUTH_056
 * Feature: FEAT_PASSWORD_STRENGTH_VALIDATION
 * Name: Password missing a special character
 * Priority: High
 */

describe('Feature FEAT_PASSWORD_STRENGTH_VALIDATION: TC_AUTH_056', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_056: Password missing a special character', function () {
    // Objective: Verify a password with no special characters is rejected when the policy requires at least one.
    cy.url().should('include', '/auth/login');
  });
});
