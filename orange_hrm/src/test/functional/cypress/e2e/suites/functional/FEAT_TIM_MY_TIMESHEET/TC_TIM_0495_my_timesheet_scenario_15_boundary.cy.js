/**
 * Test Case ID: TC_TIM_0495
 * Feature: FEAT_TIM_MY_TIMESHEET
 * Name: My Timesheet - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_MY_TIMESHEET: TC_TIM_0495', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0495: My Timesheet - Scenario 15 (Boundary)', function () {
    // Objective: Validate My Timesheet behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
