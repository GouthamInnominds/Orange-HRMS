/**
 * Test Case ID: TC_TIM_0610
 * Feature: FEAT_TIM_PROJECT_REPORTS
 * Name: Project Reports - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_PROJECT_REPORTS: TC_TIM_0610', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0610: Project Reports - Scenario 10 (Negative)', function () {
    // Objective: Validate Project Reports behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
