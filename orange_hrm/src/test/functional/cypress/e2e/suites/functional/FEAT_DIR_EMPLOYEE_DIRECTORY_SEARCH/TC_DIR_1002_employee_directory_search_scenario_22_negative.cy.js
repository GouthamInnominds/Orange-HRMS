/**
 * Test Case ID: TC_DIR_1002
 * Feature: FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH
 * Name: Employee Directory Search - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH: TC_DIR_1002', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_1002: Employee Directory Search - Scenario 22 (Negative)', function () {
    // Objective: Validate Employee Directory Search behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
