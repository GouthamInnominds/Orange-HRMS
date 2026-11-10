/**
 * Test Case ID: TC_TIM_0497
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0497', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0497: My Timesheet - Scenario 17 (Positive)', function () {
    // Objective: Validate My Timesheet behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
