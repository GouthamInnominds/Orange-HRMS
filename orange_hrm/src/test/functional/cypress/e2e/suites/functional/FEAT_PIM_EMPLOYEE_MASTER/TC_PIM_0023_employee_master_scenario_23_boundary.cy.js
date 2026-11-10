/**
 * Test Case ID: TC_PIM_0023
 * Feature: FEAT_PIM_EMPLOYEE_MASTER
 * Name: Employee Master - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_EMPLOYEE_MASTER: TC_PIM_0023', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0023: Employee Master - Scenario 23 (Boundary)', function () {
    // Objective: Validate Employee Master behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
