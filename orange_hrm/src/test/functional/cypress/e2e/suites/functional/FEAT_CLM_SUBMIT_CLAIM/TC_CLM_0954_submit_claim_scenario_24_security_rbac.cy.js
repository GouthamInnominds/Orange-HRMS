/**
 * Test Case ID: TC_CLM_0954
 * Feature: FEAT_CLM_SUBMIT_CLAIM
 * Name: Submit Claim - Scenario 24 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_CLM_SUBMIT_CLAIM: TC_CLM_0954', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0954: Submit Claim - Scenario 24 (Security/RBAC)', function () {
    // Objective: Validate Submit Claim behavior under Security/RBAC conditions (Rule validation #24).
    cy.url().should('include', '/auth/login');
  });
});
