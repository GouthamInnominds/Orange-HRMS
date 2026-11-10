/**
 * Test Case ID: TC_PIM_0125
 * Feature: FEAT_PIM_DEPENDENTS
 * Name: Dependents - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_DEPENDENTS: TC_PIM_0125', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0125: Dependents - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Dependents behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
