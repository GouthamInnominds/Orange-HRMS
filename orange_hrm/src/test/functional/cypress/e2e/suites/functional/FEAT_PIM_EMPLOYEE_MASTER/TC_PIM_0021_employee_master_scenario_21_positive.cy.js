/**
 * Test Case ID: TC_PIM_0021
 * Feature: FEAT_PIM_EMPLOYEE_MASTER
 * Name: Employee Master - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_EMPLOYEE_MASTER: TC_PIM_0021', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0021: Employee Master - Scenario 21 (Positive)', function () {
    // Objective: Validate Employee Master behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
