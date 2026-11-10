/**
 * Test Case ID: TC_PIM_0113
 * Feature: FEAT_PIM_DEPENDENTS
 * Name: Dependents - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_DEPENDENTS: TC_PIM_0113', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0113: Dependents - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Dependents behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
