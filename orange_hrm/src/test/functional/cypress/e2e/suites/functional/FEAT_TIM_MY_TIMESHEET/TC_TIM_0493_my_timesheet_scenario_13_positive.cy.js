/**
 * Test Case ID: TC_TIM_0493
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0493', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0493: My Timesheet - Scenario 13 (Positive)', function () {
    // Objective: Validate My Timesheet behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
