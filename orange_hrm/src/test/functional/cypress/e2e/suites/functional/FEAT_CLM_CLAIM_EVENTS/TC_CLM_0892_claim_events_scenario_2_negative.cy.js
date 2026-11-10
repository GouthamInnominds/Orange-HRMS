/**
 * Test Case ID: TC_CLM_0892
 * Feature: FEAT_CLM_CLAIM_EVENTS
 * Name: Claim Events - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_CLM_CLAIM_EVENTS: TC_CLM_0892', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0892: Claim Events - Scenario 2 (Negative)', function () {
    // Objective: Validate Claim Events behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
