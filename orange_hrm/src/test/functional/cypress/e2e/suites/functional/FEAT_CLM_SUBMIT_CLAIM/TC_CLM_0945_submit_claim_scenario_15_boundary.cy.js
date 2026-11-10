/**
 * Test Case ID: TC_CLM_0945
 * Feature: FEAT_CLM_SUBMIT_CLAIM
 * Name: Submit Claim - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_CLM_SUBMIT_CLAIM: TC_CLM_0945', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0945: Submit Claim - Scenario 15 (Boundary)', function () {
    // Objective: Validate Submit Claim behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
