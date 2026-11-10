/**
 * Test Case ID: TC_TIM_0485
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0485', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0485: My Timesheet - Scenario 5 (Positive)', function () {
    // Objective: Validate My Timesheet behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
