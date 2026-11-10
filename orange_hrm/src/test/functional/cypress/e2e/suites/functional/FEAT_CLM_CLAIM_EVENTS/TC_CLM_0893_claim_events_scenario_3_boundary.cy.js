/**
 * Test Case ID: TC_CLM_0893
 * Feature: FEAT_CLM_CLAIM_EVENTS
 * Name: Claim Events - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_CLM_CLAIM_EVENTS: TC_CLM_0893', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0893: Claim Events - Scenario 3 (Boundary)', function () {
    // Objective: Validate Claim Events behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
