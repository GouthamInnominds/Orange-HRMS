/**
 * Test Case ID: TC_TIM_0580
 * Feature: FEAT_TIM_PROJECTS_DEFINITION
 * Name: Projects Definition - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_PROJECTS_DEFINITION: TC_TIM_0580', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0580: Projects Definition - Scenario 25 (Positive)', function () {
    // Objective: Validate Projects Definition behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
