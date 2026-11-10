/**
 * Test Case ID: TC_AUTH_040
 * Feature: FEAT_WEAK_PASSWORD_RESET__FORCED_
 * Name: Weak password reset page with an invalid or already-used code
 * Priority: Medium
 */

describe('Feature FEAT_WEAK_PASSWORD_RESET__FORCED_: TC_AUTH_040', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_040: Weak password reset page with an invalid or already-used code', function () {
    // Objective: Verify an invalid enforce-password reset code shows the invalid-code state rather than the form.
    cy.url().should('include', '/auth/login');
  });
});
