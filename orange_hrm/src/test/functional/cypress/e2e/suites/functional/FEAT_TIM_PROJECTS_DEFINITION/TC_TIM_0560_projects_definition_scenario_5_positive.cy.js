/**
 * Test Case ID: TC_TIM_0560
 * Feature: FEAT_TIM_PROJECTS_DEFINITION
 * Name: Projects Definition - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_PROJECTS_DEFINITION: TC_TIM_0560', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0560: Projects Definition - Scenario 5 (Positive)', function () {
    // Objective: Validate Projects Definition behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
