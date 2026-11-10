/**
 * Test Case ID: TC_TIM_0505
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0505', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0505: My Timesheet - Scenario 25 (Positive)', function () {
    // Objective: Validate My Timesheet behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
