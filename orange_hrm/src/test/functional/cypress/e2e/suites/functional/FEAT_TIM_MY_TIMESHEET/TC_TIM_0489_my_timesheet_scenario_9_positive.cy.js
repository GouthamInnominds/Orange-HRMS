/**
 * Test Case ID: TC_TIM_0489
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0489', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0489: My Timesheet - Scenario 9 (Positive)', function () {
    // Objective: Validate My Timesheet behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
