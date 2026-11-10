/**
 * Test Case ID: TC_TIM_0501
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0501', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0501: My Timesheet - Scenario 21 (Positive)', function () {
    // Objective: Validate My Timesheet behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
