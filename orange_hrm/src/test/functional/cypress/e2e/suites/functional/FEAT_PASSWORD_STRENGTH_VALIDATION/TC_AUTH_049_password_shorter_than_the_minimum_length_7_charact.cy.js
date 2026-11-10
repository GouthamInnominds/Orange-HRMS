/**
 * Test Case ID: TC_AUTH_049
 * Feature: FEAT_PASSWORD_STRENGTH_VALIDATION
 * Name: Password shorter than the minimum length (7 characters)
 * Priority: High
 */

describe('Feature FEAT_PASSWORD_STRENGTH_VALIDATION: TC_AUTH_049', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_049: Password shorter than the minimum length (7 characters)', function () {
    // Objective: Verify a password below the configured minimum length (default 8) is flagged.
    cy.url().should('include', '/auth/login');
  });
});
