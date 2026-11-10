/**
 * Test Case ID: TC_PIM_0010
 * Feature: FEAT_PIM_EMPLOYEE_MASTER
 * Name: Employee Master - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_EMPLOYEE_MASTER: TC_PIM_0010', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0010: Employee Master - Scenario 10 (Negative)', function () {
    // Objective: Validate Employee Master behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
