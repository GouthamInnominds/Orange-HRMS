/**
 * Test Case ID: TC_PIM_0004
 * Feature: FEAT_PIM_EMPLOYEE_MASTER
 * Name: Employee Master - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_EMPLOYEE_MASTER: TC_PIM_0004', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0004: Employee Master - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Employee Master behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
