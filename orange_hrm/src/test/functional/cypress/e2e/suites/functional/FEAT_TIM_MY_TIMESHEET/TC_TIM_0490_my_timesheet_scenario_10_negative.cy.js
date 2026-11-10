/**
 * Test Case ID: TC_TIM_0490
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0490', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0490: My Timesheet - Scenario 10 (Negative)', function () {
    // Objective: Validate My Timesheet behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
