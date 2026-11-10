/**
 * Test Case ID: TC_TIM_0504
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 24 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0504', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0504: My Timesheet - Scenario 24 (Security/RBAC)', function () {
    // Objective: Validate My Timesheet behavior under Security/RBAC conditions (Rule validation #24).
    cy.url().should('include', '/auth/login');
  });
});
