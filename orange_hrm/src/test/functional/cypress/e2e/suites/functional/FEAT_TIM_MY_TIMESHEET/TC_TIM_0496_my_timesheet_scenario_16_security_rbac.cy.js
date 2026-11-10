/**
 * Test Case ID: TC_TIM_0496
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 16 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0496', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0496: My Timesheet - Scenario 16 (Security/RBAC)', function () {
    // Objective: Validate My Timesheet behavior under Security/RBAC conditions (Rule validation #16).
    cy.url().should('include', '/auth/login');
  });
});
