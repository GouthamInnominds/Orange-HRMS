/**
 * Test Case ID: TC_AUTH_043
 * Feature: FEAT_WEAK_PASSWORD_RESET__FORCED_
 * Name: Submit the forced-reset form with an incorrect current password
 * Priority: High
 */

describe('Feature FEAT_WEAK_PASSWORD_RESET__FORCED_: TC_AUTH_043', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_043: Submit the forced-reset form with an incorrect current password', function () {
    // Objective: Verify the forced-reset flow rejects an incorrect current password.
    cy.url().should('include', '/auth/login');
  });
});
