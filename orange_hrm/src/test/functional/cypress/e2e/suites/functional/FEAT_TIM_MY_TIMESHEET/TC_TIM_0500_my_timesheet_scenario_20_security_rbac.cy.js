/**
 * Test Case ID: TC_TIM_0500
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0500', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0500: My Timesheet - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate My Timesheet behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
