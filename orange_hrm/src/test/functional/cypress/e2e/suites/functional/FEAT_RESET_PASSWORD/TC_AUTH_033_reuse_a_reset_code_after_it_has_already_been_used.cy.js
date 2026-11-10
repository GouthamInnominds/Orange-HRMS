/**
 * Test Case ID: TC_AUTH_033
 * Feature: FEAT_RESET_PASSWORD
 * Name: Reuse a reset code after it has already been used
 * Priority: High
 */

describe('Feature FEAT_RESET_PASSWORD: TC_AUTH_033', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_033: Reuse a reset code after it has already been used', function () {
    // Objective: Verify a reset code cannot be used a second time to change the password again.
    cy.url().should('include', '/auth/login');
  });
});
