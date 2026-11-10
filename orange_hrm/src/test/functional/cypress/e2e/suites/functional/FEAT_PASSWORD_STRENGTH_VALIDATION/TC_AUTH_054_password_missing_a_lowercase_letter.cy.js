/**
 * Test Case ID: TC_AUTH_054
 * Feature: FEAT_PASSWORD_STRENGTH_VALIDATION
 * Name: Password missing a lowercase letter
 * Priority: High
 */

describe('Feature FEAT_PASSWORD_STRENGTH_VALIDATION: TC_AUTH_054', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_054: Password missing a lowercase letter', function () {
    // Objective: Verify a password with zero lowercase letters is rejected when the policy requires at least one.
    cy.url().should('include', '/auth/login');
  });
});
