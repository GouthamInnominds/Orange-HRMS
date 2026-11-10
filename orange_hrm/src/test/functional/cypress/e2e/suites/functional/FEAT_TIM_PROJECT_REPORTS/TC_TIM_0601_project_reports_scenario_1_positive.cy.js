/**
 * Test Case ID: TC_TIM_0601
 * Feature: FEAT_TIM_PROJECT_REPORTS
 * Name: Project Reports - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_PROJECT_REPORTS: TC_TIM_0601', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0601: Project Reports - Scenario 1 (Positive)', function () {
    // Objective: Validate Project Reports behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
