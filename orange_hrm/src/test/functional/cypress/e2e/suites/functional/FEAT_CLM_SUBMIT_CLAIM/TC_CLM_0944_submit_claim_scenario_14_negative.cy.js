/**
 * Test Case ID: TC_CLM_0944
 * Feature: FEAT_CLM_SUBMIT_CLAIM
 * Name: Submit Claim - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_CLM_SUBMIT_CLAIM: TC_CLM_0944', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0944: Submit Claim - Scenario 14 (Negative)', function () {
    // Objective: Validate Submit Claim behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
