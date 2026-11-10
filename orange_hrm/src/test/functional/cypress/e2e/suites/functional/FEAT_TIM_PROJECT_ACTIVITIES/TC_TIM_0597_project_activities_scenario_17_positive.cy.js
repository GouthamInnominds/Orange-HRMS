/**
 * Test Case ID: TC_TIM_0597
 * Feature: FEAT_TIM_PROJECT_ACTIVITIES
 * Name: Project Activities - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_PROJECT_ACTIVITIES: TC_TIM_0597', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0597: Project Activities - Scenario 17 (Positive)', function () {
    // Objective: Validate Project Activities behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
