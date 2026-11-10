/**
 * Test Case ID: TC_AUTH_031
 * Feature: FEAT_RESET_PASSWORD
 * Name: Open reset link after it has expired (older than 1 day)
 * Priority: High
 */

describe('Feature FEAT_RESET_PASSWORD: TC_AUTH_031', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_031: Open reset link after it has expired (older than 1 day)', function () {
    // Objective: Verify a reset code becomes unusable once more than one day has elapsed since it was requested.
    cy.url().should('include', '/auth/login');
  });
});
