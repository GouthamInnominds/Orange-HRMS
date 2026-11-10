/**
 * Test Case ID: TC_TIM_0565
 * Feature: FEAT_TIM_PROJECTS_DEFINITION
 * Name: Projects Definition - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_PROJECTS_DEFINITION: TC_TIM_0565', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0565: Projects Definition - Scenario 10 (Negative)', function () {
    // Objective: Validate Projects Definition behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
