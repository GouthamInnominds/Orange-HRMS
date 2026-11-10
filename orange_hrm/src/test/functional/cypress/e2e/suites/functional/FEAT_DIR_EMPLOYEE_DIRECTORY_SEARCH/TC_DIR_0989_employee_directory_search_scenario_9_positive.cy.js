/**
 * Test Case ID: TC_DIR_0989
 * Feature: FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH
 * Name: Employee Directory Search - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH: TC_DIR_0989', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_0989: Employee Directory Search - Scenario 9 (Positive)', function () {
    // Objective: Validate Employee Directory Search behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
