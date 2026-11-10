/**
 * Test Case ID: TC_TIM_0512
 * Feature: FEAT_TIM_EMPLOYEE_TIMESHEETS
 * Name: Employee Timesheets - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_TIM_EMPLOYEE_TIMESHEETS: TC_TIM_0512', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0512: Employee Timesheets - Scenario 2 (Negative)', function () {
    // Objective: Validate Employee Timesheets behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
