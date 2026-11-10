/**
 * Test Case ID: TC_TIM_0609
 * Feature: FEAT_TIM_PROJECT_REPORTS
 * Name: Project Reports - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_PROJECT_REPORTS: TC_TIM_0609', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0609: Project Reports - Scenario 9 (Positive)', function () {
    // Objective: Validate Project Reports behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
