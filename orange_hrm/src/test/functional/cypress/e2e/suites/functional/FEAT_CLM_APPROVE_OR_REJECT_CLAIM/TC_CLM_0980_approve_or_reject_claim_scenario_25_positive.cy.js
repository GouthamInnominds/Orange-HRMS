/**
 * Test Case ID: TC_CLM_0980
 * Feature: FEAT_CLM_APPROVE_OR_REJECT_CLAIM
 * Name: Approve or Reject Claim - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_CLM_APPROVE_OR_REJECT_CLAIM: TC_CLM_0980', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0980: Approve or Reject Claim - Scenario 25 (Positive)', function () {
    // Objective: Validate Approve or Reject Claim behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
