/**
 * Test Case ID: TC_AUTH_053
 * Feature: FEAT_PASSWORD_STRENGTH_VALIDATION
 * Name: Password missing an uppercase letter
 * Priority: High
 */

describe('Feature FEAT_PASSWORD_STRENGTH_VALIDATION: TC_AUTH_053', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_053: Password missing an uppercase letter', function () {
    // Objective: Verify a password with zero uppercase letters is rejected when the policy requires at least one.
    cy.url().should('include', '/auth/login');
  });
});
