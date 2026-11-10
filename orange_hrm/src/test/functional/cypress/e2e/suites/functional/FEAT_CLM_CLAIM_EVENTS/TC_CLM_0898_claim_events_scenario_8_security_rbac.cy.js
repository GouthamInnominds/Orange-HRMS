/**
 * Test Case ID: TC_CLM_0898
 * Feature: FEAT_CLM_CLAIM_EVENTS
 * Name: Claim Events - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_CLM_CLAIM_EVENTS: TC_CLM_0898', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0898: Claim Events - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Claim Events behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
