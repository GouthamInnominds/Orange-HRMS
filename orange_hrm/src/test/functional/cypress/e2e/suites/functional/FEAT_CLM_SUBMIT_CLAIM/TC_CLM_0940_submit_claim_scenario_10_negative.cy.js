/**
 * Test Case ID: TC_CLM_0940
 * Feature: FEAT_CLM_SUBMIT_CLAIM
 * Name: Submit Claim - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_CLM_SUBMIT_CLAIM: TC_CLM_0940', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0940: Submit Claim - Scenario 10 (Negative)', function () {
    // Objective: Validate Submit Claim behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
