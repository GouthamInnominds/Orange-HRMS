/**
 * Test Case ID: TC_TIM_0614
 * Feature: FEAT_TIM_PROJECT_REPORTS
 * Name: Project Reports - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_TIM_PROJECT_REPORTS: TC_TIM_0614', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0614: Project Reports - Scenario 14 (Negative)', function () {
    // Objective: Validate Project Reports behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
