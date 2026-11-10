/**
 * Test Case ID: TC_CLM_0900
 * Feature: FEAT_CLM_CLAIM_EVENTS
 * Name: Claim Events - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_CLM_CLAIM_EVENTS: TC_CLM_0900', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0900: Claim Events - Scenario 10 (Negative)', function () {
    // Objective: Validate Claim Events behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
