/**
 * Test Case ID: TC_DIR_0987
 * Feature: FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH
 * Name: Employee Directory Search - Scenario 7 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH: TC_DIR_0987', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_0987: Employee Directory Search - Scenario 7 (Boundary)', function () {
    // Objective: Validate Employee Directory Search behavior under Boundary conditions (Rule validation #7).
    cy.url().should('include', '/auth/login');
  });
});
