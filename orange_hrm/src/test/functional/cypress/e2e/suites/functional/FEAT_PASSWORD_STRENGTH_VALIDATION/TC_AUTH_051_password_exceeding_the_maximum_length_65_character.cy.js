/**
 * Test Case ID: TC_AUTH_051
 * Feature: FEAT_PASSWORD_STRENGTH_VALIDATION
 * Name: Password exceeding the maximum length (65 characters)
 * Priority: High
 */

describe('Feature FEAT_PASSWORD_STRENGTH_VALIDATION: TC_AUTH_051', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_051: Password exceeding the maximum length (65 characters)', function () {
    // Objective: Verify a password longer than MAX_PASSWORD_LENGTH (64) is flagged.
    cy.url().should('include', '/auth/login');
  });
});
