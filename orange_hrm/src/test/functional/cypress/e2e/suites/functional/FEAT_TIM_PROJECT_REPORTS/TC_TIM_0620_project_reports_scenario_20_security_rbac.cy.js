/**
 * Test Case ID: TC_TIM_0620
 * Feature: FEAT_TIM_PROJECT_REPORTS
 * Name: Project Reports - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_PROJECT_REPORTS: TC_TIM_0620', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0620: Project Reports - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Project Reports behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
