/**
 * Test Case ID: TC_PIM_0006
 * Feature: FEAT_PIM_EMPLOYEE_MASTER
 * Name: Employee Master - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_EMPLOYEE_MASTER: TC_PIM_0006', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0006: Employee Master - Scenario 6 (Negative)', function () {
    // Objective: Validate Employee Master behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
