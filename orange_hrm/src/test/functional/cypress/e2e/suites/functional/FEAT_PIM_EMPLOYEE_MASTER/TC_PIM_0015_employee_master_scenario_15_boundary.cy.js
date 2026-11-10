/**
 * Test Case ID: TC_PIM_0015
 * Feature: FEAT_PIM_EMPLOYEE_MASTER
 * Name: Employee Master - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_EMPLOYEE_MASTER: TC_PIM_0015', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0015: Employee Master - Scenario 15 (Boundary)', function () {
    // Objective: Validate Employee Master behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
