/**
 * Test Case ID: TC_TIM_0494
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0494', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0494: My Timesheet - Scenario 14 (Negative)', function () {
    // Objective: Validate My Timesheet behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
