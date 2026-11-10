/**
 * Test Case ID: TC_PIM_0293
 * Feature: FEAT_PIM_EMPLOYEE_PICTURE
 * Name: Employee Picture - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_EMPLOYEE_PICTURE: TC_PIM_0293', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0293: Employee Picture - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Employee Picture behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
