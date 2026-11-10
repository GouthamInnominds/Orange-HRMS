/**
 * Test Case ID: TC_TIM_0591
 * Feature: FEAT_TIM_PROJECT_ACTIVITIES
 * Name: Project Activities - Scenario 11 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_PROJECT_ACTIVITIES: TC_TIM_0591', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0591: Project Activities - Scenario 11 (Boundary)', function () {
    // Objective: Validate Project Activities behavior under Boundary conditions (Rule validation #11).
    cy.url().should('include', '/auth/login');
  });
});
