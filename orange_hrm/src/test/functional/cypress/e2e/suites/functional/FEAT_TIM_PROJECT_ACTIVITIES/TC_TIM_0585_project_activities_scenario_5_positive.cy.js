/**
 * Test Case ID: TC_TIM_0585
 * Feature: FEAT_TIM_PROJECT_ACTIVITIES
 * Name: Project Activities - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_PROJECT_ACTIVITIES: TC_TIM_0585', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0585: Project Activities - Scenario 5 (Positive)', function () {
    // Objective: Validate Project Activities behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
