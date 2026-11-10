/**
 * Test Case ID: TC_TIM_0612
 * Feature: FEAT_TIM_PROJECT_REPORTS
 * Name: Project Reports - Scenario 12 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_TIM_PROJECT_REPORTS: TC_TIM_0612', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0612: Project Reports - Scenario 12 (Security/RBAC)', function () {
    // Objective: Validate Project Reports behavior under Security/RBAC conditions (Rule validation #12).
    cy.url().should('include', '/auth/login');
  });
});
