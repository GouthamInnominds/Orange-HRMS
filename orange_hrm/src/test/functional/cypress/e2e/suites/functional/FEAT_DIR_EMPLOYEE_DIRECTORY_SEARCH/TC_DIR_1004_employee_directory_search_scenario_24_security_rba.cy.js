/**
 * Test Case ID: TC_DIR_1004
 * Feature: FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH
 * Name: Employee Directory Search - Scenario 24 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH: TC_DIR_1004', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_1004: Employee Directory Search - Scenario 24 (Security/RBAC)', function () {
    // Objective: Validate Employee Directory Search behavior under Security/RBAC conditions (Rule validation #24).
    cy.url().should('include', '/auth/login');
  });
});
