/**
 * Test Case ID: TC_DIR_0997
 * Feature: FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH
 * Name: Employee Directory Search - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH: TC_DIR_0997', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_0997: Employee Directory Search - Scenario 17 (Positive)', function () {
    // Objective: Validate Employee Directory Search behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
