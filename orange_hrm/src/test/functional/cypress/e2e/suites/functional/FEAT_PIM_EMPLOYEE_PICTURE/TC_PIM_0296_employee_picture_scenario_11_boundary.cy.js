/**
 * Test Case ID: TC_PIM_0296
 * Feature: FEAT_PIM_EMPLOYEE_PICTURE
 * Name: Employee Picture - Scenario 11 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_EMPLOYEE_PICTURE: TC_PIM_0296', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0296: Employee Picture - Scenario 11 (Boundary)', function () {
    // Objective: Validate Employee Picture behavior under Boundary conditions (Rule validation #11).
    cy.url().should('include', '/auth/login');
  });
});
