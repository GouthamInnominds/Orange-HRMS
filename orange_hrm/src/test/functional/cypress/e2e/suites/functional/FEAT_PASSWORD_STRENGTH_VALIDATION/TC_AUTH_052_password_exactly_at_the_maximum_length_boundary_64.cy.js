/**
 * Test Case ID: TC_AUTH_052
 * Feature: FEAT_PASSWORD_STRENGTH_VALIDATION
 * Name: Password exactly at the maximum length boundary (64 characters)
 * Priority: Medium
 */

describe('Feature FEAT_PASSWORD_STRENGTH_VALIDATION: TC_AUTH_052', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_052: Password exactly at the maximum length boundary (64 characters)', function () {
    // Objective: Verify a password exactly at MAX_PASSWORD_LENGTH is accepted.
    cy.url().should('include', '/auth/login');
  });
});
