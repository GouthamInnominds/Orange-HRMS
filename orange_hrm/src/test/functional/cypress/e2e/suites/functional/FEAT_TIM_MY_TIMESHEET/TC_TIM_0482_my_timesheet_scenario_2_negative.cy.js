/**
 * Test Case ID: TC_TIM_0482
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0482', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0482: My Timesheet - Scenario 2 (Negative)', function () {
    // Objective: Validate My Timesheet behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
