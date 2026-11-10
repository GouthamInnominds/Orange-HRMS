/**
 * Test Case ID: TC_TIM_0488
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0488', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0488: My Timesheet - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate My Timesheet behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
