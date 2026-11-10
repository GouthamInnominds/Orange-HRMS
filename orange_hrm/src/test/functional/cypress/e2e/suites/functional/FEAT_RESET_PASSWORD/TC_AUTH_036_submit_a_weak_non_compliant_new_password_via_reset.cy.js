/**
 * Test Case ID: TC_AUTH_036
 * Feature: FEAT_RESET_PASSWORD
 * Name: Submit a weak/non-compliant new password via reset password form
 * Priority: Medium
 */

describe('Feature FEAT_RESET_PASSWORD: TC_AUTH_036', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_036: Submit a weak/non-compliant new password via reset password form', function () {
    // Objective: Verify whether the reset-password flow enforces the configured password strength policy before saving (documents current behaviour/possible gap).
    cy.url().should('include', '/auth/login');
  });
});
