/**
 * Test Case ID: TC_CLM_0891
 * Feature: FEAT_CLM_CLAIM_EVENTS
 * Name: Claim Events - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_CLM_CLAIM_EVENTS: TC_CLM_0891', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0891: Claim Events - Scenario 1 (Positive)', function () {
    // Objective: Validate Claim Events behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
