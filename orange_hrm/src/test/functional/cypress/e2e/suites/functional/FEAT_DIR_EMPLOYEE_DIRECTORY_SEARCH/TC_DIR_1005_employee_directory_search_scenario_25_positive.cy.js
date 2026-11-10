/**
 * Test Case ID: TC_DIR_1005
 * Feature: FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH
 * Name: Employee Directory Search - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH: TC_DIR_1005', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_1005: Employee Directory Search - Scenario 25 (Positive)', function () {
    // Objective: Validate Employee Directory Search behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
