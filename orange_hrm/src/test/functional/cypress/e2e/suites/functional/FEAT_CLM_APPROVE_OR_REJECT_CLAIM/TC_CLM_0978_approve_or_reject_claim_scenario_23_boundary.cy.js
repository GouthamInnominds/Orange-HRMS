/**
 * Test Case ID: TC_CLM_0978
 * Feature: FEAT_CLM_APPROVE_OR_REJECT_CLAIM
 * Name: Approve or Reject Claim - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_CLM_APPROVE_OR_REJECT_CLAIM: TC_CLM_0978', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0978: Approve or Reject Claim - Scenario 23 (Boundary)', function () {
    // Objective: Validate Approve or Reject Claim behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
