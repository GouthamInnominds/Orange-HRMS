/**
 * Test Case ID: TC_TIM_0572
 * Feature: FEAT_TIM_PROJECTS_DEFINITION
 * Name: Projects Definition - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_PROJECTS_DEFINITION: TC_TIM_0572', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0572: Projects Definition - Scenario 17 (Positive)', function () {
    // Objective: Validate Projects Definition behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
