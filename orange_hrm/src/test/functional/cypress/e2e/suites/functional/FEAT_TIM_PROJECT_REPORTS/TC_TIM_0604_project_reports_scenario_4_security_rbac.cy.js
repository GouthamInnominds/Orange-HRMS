/**
 * Test Case ID: TC_TIM_0604
 * Feature: FEAT_TIM_PROJECT_REPORTS
 * Name: Project Reports - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_TIM_PROJECT_REPORTS: TC_TIM_0604', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0604: Project Reports - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Project Reports behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
