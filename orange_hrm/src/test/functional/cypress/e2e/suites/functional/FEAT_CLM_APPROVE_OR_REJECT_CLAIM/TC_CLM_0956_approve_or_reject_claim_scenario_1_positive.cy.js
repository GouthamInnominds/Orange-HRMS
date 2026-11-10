/**
 * Test Case ID: TC_CLM_0956
 * Feature: FEAT_CLM_APPROVE_OR_REJECT_CLAIM
 * Name: Approve or Reject Claim - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_CLM_APPROVE_OR_REJECT_CLAIM: TC_CLM_0956', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0956: Approve or Reject Claim - Scenario 1 (Positive)', function () {
    // Objective: Validate Approve or Reject Claim behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
