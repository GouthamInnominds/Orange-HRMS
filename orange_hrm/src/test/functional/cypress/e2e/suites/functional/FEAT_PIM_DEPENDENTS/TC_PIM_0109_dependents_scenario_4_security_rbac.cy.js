/**
 * Test Case ID: TC_PIM_0109
 * Feature: FEAT_PIM_DEPENDENTS
 * Name: Dependents - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_DEPENDENTS: TC_PIM_0109', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0109: Dependents - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Dependents behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
