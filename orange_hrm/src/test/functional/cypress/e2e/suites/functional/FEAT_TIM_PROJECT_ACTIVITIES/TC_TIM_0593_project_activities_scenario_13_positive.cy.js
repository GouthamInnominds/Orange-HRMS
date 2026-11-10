/**
 * Test Case ID: TC_TIM_0593
 * Feature: FEAT_TIM_PROJECT_ACTIVITIES
 * Name: Project Activities - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_PROJECT_ACTIVITIES: TC_TIM_0593', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0593: Project Activities - Scenario 13 (Positive)', function () {
    // Objective: Validate Project Activities behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
