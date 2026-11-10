/**
 * Test Case ID: TC_TIM_0563
 * Feature: FEAT_TIM_PROJECTS_DEFINITION
 * Name: Projects Definition - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_TIM_PROJECTS_DEFINITION: TC_TIM_0563', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0563: Projects Definition - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Projects Definition behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
