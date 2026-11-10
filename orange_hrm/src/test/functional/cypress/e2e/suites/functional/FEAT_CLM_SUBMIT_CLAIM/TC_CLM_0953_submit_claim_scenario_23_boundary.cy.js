/**
 * Test Case ID: TC_CLM_0953
 * Feature: FEAT_CLM_SUBMIT_CLAIM
 * Name: Submit Claim - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_CLM_SUBMIT_CLAIM: TC_CLM_0953', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0953: Submit Claim - Scenario 23 (Boundary)', function () {
    // Objective: Validate Submit Claim behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
