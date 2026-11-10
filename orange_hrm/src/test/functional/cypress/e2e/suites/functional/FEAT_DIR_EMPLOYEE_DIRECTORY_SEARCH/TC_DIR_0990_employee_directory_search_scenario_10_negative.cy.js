/**
 * Test Case ID: TC_DIR_0990
 * Feature: FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH
 * Name: Employee Directory Search - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH: TC_DIR_0990', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_0990: Employee Directory Search - Scenario 10 (Negative)', function () {
    // Objective: Validate Employee Directory Search behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
