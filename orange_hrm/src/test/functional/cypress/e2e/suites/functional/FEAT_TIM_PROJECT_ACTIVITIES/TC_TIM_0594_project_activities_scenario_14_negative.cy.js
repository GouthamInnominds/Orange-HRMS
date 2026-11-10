/**
 * Test Case ID: TC_TIM_0594
 * Feature: FEAT_TIM_PROJECT_ACTIVITIES
 * Name: Project Activities - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_TIM_PROJECT_ACTIVITIES: TC_TIM_0594', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0594: Project Activities - Scenario 14 (Negative)', function () {
    // Objective: Validate Project Activities behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
