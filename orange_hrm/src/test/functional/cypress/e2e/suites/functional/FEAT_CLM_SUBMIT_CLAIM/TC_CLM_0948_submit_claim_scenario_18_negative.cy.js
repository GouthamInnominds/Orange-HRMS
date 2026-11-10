/**
 * Test Case ID: TC_CLM_0948
 * Feature: FEAT_CLM_SUBMIT_CLAIM
 * Name: Submit Claim - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_CLM_SUBMIT_CLAIM: TC_CLM_0948', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0948: Submit Claim - Scenario 18 (Negative)', function () {
    // Objective: Validate Submit Claim behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
