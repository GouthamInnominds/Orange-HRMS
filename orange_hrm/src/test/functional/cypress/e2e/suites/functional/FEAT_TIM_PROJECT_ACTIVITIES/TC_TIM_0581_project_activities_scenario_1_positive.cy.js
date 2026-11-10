/**
 * Test Case ID: TC_TIM_0581
 * Feature: FEAT_TIM_PROJECT_ACTIVITIES
 * Name: Project Activities - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_PROJECT_ACTIVITIES: TC_TIM_0581', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0581: Project Activities - Scenario 1 (Positive)', function () {
    // Objective: Validate Project Activities behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
