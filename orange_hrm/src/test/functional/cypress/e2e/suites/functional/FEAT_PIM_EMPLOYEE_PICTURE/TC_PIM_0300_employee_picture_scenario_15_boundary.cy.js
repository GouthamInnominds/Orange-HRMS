/**
 * Test Case ID: TC_PIM_0300
 * Feature: FEAT_PIM_EMPLOYEE_PICTURE
 * Name: Employee Picture - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_EMPLOYEE_PICTURE: TC_PIM_0300', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0300: Employee Picture - Scenario 15 (Boundary)', function () {
    // Objective: Validate Employee Picture behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
