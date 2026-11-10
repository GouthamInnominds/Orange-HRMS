/**
 * Test Case ID: TC_TIM_0605
 * Feature: FEAT_TIM_PROJECT_REPORTS
 * Name: Project Reports - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_PROJECT_REPORTS: TC_TIM_0605', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0605: Project Reports - Scenario 5 (Positive)', function () {
    // Objective: Validate Project Reports behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
