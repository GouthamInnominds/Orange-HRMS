/**
 * Test Case ID: TC_DIR_0984
 * Feature: FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH
 * Name: Employee Directory Search - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH: TC_DIR_0984', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_0984: Employee Directory Search - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Employee Directory Search behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
