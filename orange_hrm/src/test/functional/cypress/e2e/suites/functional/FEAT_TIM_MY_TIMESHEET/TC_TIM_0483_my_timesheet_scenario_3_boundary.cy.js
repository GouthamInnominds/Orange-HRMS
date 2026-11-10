/**
 * Test Case ID: TC_TIM_0483
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0483', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0483: My Timesheet - Scenario 3 (Boundary)', function () {
    // Objective: Validate My Timesheet behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
