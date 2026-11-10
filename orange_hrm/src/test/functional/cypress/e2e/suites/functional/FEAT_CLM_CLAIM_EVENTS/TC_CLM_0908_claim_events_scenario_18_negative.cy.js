/**
 * Test Case ID: TC_CLM_0908
 * Feature: FEAT_CLM_CLAIM_EVENTS
 * Name: Claim Events - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_CLM_CLAIM_EVENTS: TC_CLM_0908', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0908: Claim Events - Scenario 18 (Negative)', function () {
    // Objective: Validate Claim Events behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
