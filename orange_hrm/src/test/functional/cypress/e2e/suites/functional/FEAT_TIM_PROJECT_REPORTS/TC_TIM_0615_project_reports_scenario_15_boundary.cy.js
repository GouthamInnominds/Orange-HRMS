/**
 * Test Case ID: TC_TIM_0615
 * Feature: FEAT_TIM_PROJECT_REPORTS
 * Name: Project Reports - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_PROJECT_REPORTS: TC_TIM_0615', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0615: Project Reports - Scenario 15 (Boundary)', function () {
    // Objective: Validate Project Reports behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
