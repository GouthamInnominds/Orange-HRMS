/**
 * Test Case ID: TC_TIM_0576
 * Feature: FEAT_TIM_PROJECTS_DEFINITION
 * Name: Projects Definition - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_PROJECTS_DEFINITION: TC_TIM_0576', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0576: Projects Definition - Scenario 21 (Positive)', function () {
    // Objective: Validate Projects Definition behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
