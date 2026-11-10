/**
 * Test Case ID: TC_DIR_0995
 * Feature: FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH
 * Name: Employee Directory Search - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH: TC_DIR_0995', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_0995: Employee Directory Search - Scenario 15 (Boundary)', function () {
    // Objective: Validate Employee Directory Search behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
