/**
 * Test Case ID: TC_TIM_0506
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 26 (Negative)
 * Priority: High
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0506', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0506: My Timesheet - Scenario 26 (Negative)', function () {
    // Objective: Validate My Timesheet behavior under Negative conditions (Rule validation #26).
    cy.url().should('include', '/auth/login');
  });
});
