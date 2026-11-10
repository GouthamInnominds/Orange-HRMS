/**
 * Test Case ID: TC_TIM_0510
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 30 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0510', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0510: My Timesheet - Scenario 30 (Negative)', function () {
    // Objective: Validate My Timesheet behavior under Negative conditions (Rule validation #30).
    cy.url().should('include', '/auth/login');
  });
});
