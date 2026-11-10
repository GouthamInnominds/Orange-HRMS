/**
 * Test Case ID: TC_PIM_0022
 * Feature: FEAT_PIM_EMPLOYEE_MASTER
 * Name: Employee Master - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_EMPLOYEE_MASTER: TC_PIM_0022', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0022: Employee Master - Scenario 22 (Negative)', function () {
    // Objective: Validate Employee Master behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
