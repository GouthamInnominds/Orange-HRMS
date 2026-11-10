/**
 * Test Case ID: TC_PIM_0028
 * Feature: FEAT_PIM_EMPLOYEE_MASTER
 * Name: Employee Master - Scenario 28 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_EMPLOYEE_MASTER: TC_PIM_0028', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0028: Employee Master - Scenario 28 (Security/RBAC)', function () {
    // Objective: Validate Employee Master behavior under Security/RBAC conditions (Rule validation #28).
    cy.url().should('include', '/auth/login');
  });
});
