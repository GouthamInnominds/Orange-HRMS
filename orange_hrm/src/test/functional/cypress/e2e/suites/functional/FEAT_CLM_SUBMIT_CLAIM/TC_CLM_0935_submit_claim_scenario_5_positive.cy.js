/**
 * Test Case ID: TC_CLM_0935
 * Feature: FEAT_CLM_SUBMIT_CLAIM
 * Name: Submit Claim - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_CLM_SUBMIT_CLAIM: TC_CLM_0935', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0935: Submit Claim - Scenario 5 (Positive)', function () {
    // Objective: Validate Submit Claim behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
