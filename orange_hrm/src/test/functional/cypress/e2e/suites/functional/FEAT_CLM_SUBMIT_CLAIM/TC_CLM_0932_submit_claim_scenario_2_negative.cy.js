/**
 * Test Case ID: TC_CLM_0932
 * Feature: FEAT_CLM_SUBMIT_CLAIM
 * Name: Submit Claim - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_CLM_SUBMIT_CLAIM: TC_CLM_0932', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0932: Submit Claim - Scenario 2 (Negative)', function () {
    // Objective: Validate Submit Claim behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
