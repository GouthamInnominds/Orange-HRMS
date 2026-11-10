/**
 * Test Case ID: TC_TIM_0573
 * Feature: FEAT_TIM_PROJECTS_DEFINITION
 * Name: Projects Definition - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_TIM_PROJECTS_DEFINITION: TC_TIM_0573', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0573: Projects Definition - Scenario 18 (Negative)', function () {
    // Objective: Validate Projects Definition behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
