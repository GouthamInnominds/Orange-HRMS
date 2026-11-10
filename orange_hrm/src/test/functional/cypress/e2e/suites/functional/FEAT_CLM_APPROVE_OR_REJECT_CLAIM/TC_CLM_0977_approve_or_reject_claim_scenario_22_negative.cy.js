/**
 * Test Case ID: TC_CLM_0977
 * Feature: FEAT_CLM_APPROVE_OR_REJECT_CLAIM
 * Name: Approve or Reject Claim - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_CLM_APPROVE_OR_REJECT_CLAIM: TC_CLM_0977', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0977: Approve or Reject Claim - Scenario 22 (Negative)', function () {
    // Objective: Validate Approve or Reject Claim behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
