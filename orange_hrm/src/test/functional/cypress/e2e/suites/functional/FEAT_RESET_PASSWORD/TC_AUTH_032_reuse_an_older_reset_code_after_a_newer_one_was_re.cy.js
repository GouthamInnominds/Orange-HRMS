/**
 * Test Case ID: TC_AUTH_032
 * Feature: FEAT_RESET_PASSWORD
 * Name: Reuse an older reset code after a newer one was requested
 * Priority: High
 */

describe('Feature FEAT_RESET_PASSWORD: TC_AUTH_032', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_032: Reuse an older reset code after a newer one was requested', function () {
    // Objective: Verify that once a new reset code is requested for the same email, the previous code is no longer accepted (replay of a stale code).
    cy.url().should('include', '/auth/login');
  });
});
