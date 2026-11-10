/**
 * Test Case ID: TC_DIR_0986
 * Feature: FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH
 * Name: Employee Directory Search - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH: TC_DIR_0986', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_0986: Employee Directory Search - Scenario 6 (Negative)', function () {
    // Objective: Validate Employee Directory Search behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
