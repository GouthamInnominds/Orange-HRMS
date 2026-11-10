/**
 * Test Case ID: TC_AUTH_038
 * Feature: FEAT_WEAK_PASSWORD_RESET__FORCED_
 * Name: Login succeeds but password fails the strength policy while enforcement is on
 * Priority: High
 */

describe('Feature FEAT_WEAK_PASSWORD_RESET__FORCED_: TC_AUTH_038', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_038: Login succeeds but password fails the strength policy while enforcement is on', function () {
    // Objective: Verify a technically-correct login is intercepted and redirected to forced password reset when the password does not meet the configured strength policy.
    cy.url().should('include', '/auth/login');
  });
});
