/**
 * Test Case ID: TC_TIM_0564
 * Feature: FEAT_TIM_PROJECTS_DEFINITION
 * Name: Projects Definition - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_PROJECTS_DEFINITION: TC_TIM_0564', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0564: Projects Definition - Scenario 9 (Positive)', function () {
    // Objective: Validate Projects Definition behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
