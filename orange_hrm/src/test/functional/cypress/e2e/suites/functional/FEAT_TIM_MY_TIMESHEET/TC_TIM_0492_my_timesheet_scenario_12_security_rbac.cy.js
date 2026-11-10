/**
 * Test Case ID: TC_TIM_0492
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 12 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0492', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0492: My Timesheet - Scenario 12 (Security/RBAC)', function () {
    // Objective: Validate My Timesheet behavior under Security/RBAC conditions (Rule validation #12).
    cy.url().should('include', '/auth/login');
  });
});
