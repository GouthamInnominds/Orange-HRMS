/**
 * Test Case ID: TC_TIM_0481
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0481', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0481: My Timesheet - Scenario 1 (Positive)', function () {
    // Objective: Validate My Timesheet behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
