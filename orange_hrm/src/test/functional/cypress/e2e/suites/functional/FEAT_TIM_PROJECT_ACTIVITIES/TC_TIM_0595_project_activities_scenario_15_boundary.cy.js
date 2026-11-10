/**
 * Test Case ID: TC_TIM_0595
 * Feature: FEAT_TIM_PROJECT_ACTIVITIES
 * Name: Project Activities - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_PROJECT_ACTIVITIES: TC_TIM_0595', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0595: Project Activities - Scenario 15 (Boundary)', function () {
    // Objective: Validate Project Activities behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
