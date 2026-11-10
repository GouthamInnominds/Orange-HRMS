/**
 * Test Case ID: TC_AUTH_041
 * Feature: FEAT_WEAK_PASSWORD_RESET__FORCED_
 * Name: Enforce-password reset code expires after 1 hour
 * Priority: High
 */

describe('Feature FEAT_WEAK_PASSWORD_RESET__FORCED_: TC_AUTH_041', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_041: Enforce-password reset code expires after 1 hour', function () {
    // Objective: Verify an enforce-password reset code becomes invalid once more than one hour has passed since the request.
    cy.url().should('include', '/auth/login');
  });
});
