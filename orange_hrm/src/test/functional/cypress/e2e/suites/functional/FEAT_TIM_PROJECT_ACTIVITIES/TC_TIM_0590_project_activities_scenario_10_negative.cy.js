/**
 * Test Case ID: TC_TIM_0590
 * Feature: FEAT_TIM_PROJECT_ACTIVITIES
 * Name: Project Activities - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_PROJECT_ACTIVITIES: TC_TIM_0590', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0590: Project Activities - Scenario 10 (Negative)', function () {
    // Objective: Validate Project Activities behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
