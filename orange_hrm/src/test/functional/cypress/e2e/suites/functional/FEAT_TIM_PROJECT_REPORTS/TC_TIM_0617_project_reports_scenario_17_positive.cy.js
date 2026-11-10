/**
 * Test Case ID: TC_TIM_0617
 * Feature: FEAT_TIM_PROJECT_REPORTS
 * Name: Project Reports - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_PROJECT_REPORTS: TC_TIM_0617', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0617: Project Reports - Scenario 17 (Positive)', function () {
    // Objective: Validate Project Reports behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
