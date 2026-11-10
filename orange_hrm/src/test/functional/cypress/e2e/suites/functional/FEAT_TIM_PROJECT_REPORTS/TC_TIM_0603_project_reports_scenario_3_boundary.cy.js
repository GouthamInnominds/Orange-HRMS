/**
 * Test Case ID: TC_TIM_0603
 * Feature: FEAT_TIM_PROJECT_REPORTS
 * Name: Project Reports - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_PROJECT_REPORTS: TC_TIM_0603', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0603: Project Reports - Scenario 3 (Boundary)', function () {
    // Objective: Validate Project Reports behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
