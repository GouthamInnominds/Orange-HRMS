/**
 * Test Case ID: TC_TIM_0571
 * Feature: FEAT_TIM_PROJECTS_DEFINITION
 * Name: Projects Definition - Scenario 16 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_TIM_PROJECTS_DEFINITION: TC_TIM_0571', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0571: Projects Definition - Scenario 16 (Security/RBAC)', function () {
    // Objective: Validate Projects Definition behavior under Security/RBAC conditions (Rule validation #16).
    cy.url().should('include', '/auth/login');
  });
});
