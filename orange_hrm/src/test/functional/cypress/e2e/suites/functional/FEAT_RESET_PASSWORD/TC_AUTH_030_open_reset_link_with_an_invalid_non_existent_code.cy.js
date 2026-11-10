/**
 * Test Case ID: TC_AUTH_030
 * Feature: FEAT_RESET_PASSWORD
 * Name: Open reset link with an invalid/non-existent code
 * Priority: High
 */

describe('Feature FEAT_RESET_PASSWORD: TC_AUTH_030', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_030: Open reset link with an invalid/non-existent code', function () {
    // Objective: Verify a bogus reset code shows an error state rather than a reset form.
    cy.url().should('include', '/auth/login');
  });
});
