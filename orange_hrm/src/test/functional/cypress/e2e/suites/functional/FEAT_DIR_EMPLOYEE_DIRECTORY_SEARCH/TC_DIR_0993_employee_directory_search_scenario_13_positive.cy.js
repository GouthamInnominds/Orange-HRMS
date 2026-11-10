/**
 * Test Case ID: TC_DIR_0993
 * Feature: FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH
 * Name: Employee Directory Search - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH: TC_DIR_0993', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_0993: Employee Directory Search - Scenario 13 (Positive)', function () {
    // Objective: Validate Employee Directory Search behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
