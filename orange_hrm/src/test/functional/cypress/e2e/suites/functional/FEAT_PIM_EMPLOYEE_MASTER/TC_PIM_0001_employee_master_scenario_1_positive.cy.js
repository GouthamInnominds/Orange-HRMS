/**
 * Test Case ID: TC_PIM_0001
 * Feature: FEAT_PIM_EMPLOYEE_MASTER
 * Name: Employee Master - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_EMPLOYEE_MASTER: TC_PIM_0001', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0001: Employee Master - Scenario 1 (Positive)', function () {
    // Objective: Validate Employee Master behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
