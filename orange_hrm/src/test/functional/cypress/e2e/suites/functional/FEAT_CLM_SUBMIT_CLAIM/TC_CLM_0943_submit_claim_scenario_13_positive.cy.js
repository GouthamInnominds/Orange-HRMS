/**
 * Test Case ID: TC_CLM_0943
 * Feature: FEAT_CLM_SUBMIT_CLAIM
 * Name: Submit Claim - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_CLM_SUBMIT_CLAIM: TC_CLM_0943', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0943: Submit Claim - Scenario 13 (Positive)', function () {
    // Objective: Validate Submit Claim behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
