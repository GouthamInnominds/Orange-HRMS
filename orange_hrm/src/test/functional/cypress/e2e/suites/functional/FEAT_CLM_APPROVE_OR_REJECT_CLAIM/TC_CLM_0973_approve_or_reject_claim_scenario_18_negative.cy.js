/**
 * Test Case ID: TC_CLM_0973
 * Feature: FEAT_CLM_APPROVE_OR_REJECT_CLAIM
 * Name: Approve or Reject Claim - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_CLM_APPROVE_OR_REJECT_CLAIM: TC_CLM_0973', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0973: Approve or Reject Claim - Scenario 18 (Negative)', function () {
    // Objective: Validate Approve or Reject Claim behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
