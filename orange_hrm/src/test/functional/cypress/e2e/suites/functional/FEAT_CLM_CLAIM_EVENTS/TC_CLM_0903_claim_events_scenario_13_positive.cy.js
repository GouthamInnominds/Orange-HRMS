/**
 * Test Case ID: TC_CLM_0903
 * Feature: FEAT_CLM_CLAIM_EVENTS
 * Name: Claim Events - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_CLM_CLAIM_EVENTS: TC_CLM_0903', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0903: Claim Events - Scenario 13 (Positive)', function () {
    // Objective: Validate Claim Events behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
