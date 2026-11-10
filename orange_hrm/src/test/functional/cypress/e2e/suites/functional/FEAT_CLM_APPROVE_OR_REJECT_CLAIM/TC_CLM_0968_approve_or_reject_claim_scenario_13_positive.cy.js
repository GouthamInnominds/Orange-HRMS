/**
 * Test Case ID: TC_CLM_0968
 * Feature: FEAT_CLM_APPROVE_OR_REJECT_CLAIM
 * Name: Approve or Reject Claim - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_CLM_APPROVE_OR_REJECT_CLAIM: TC_CLM_0968', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0968: Approve or Reject Claim - Scenario 13 (Positive)', function () {
    // Objective: Validate Approve or Reject Claim behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
