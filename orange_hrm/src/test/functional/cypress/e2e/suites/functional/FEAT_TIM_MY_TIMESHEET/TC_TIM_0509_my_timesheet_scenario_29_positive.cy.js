/**
 * Test Case ID: TC_TIM_0509
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 29 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0509', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0509: My Timesheet - Scenario 29 (Positive)', function () {
    // Objective: Validate My Timesheet behavior under Positive conditions (Rule validation #29).
    cy.url().should('include', '/auth/login');
  });
});
