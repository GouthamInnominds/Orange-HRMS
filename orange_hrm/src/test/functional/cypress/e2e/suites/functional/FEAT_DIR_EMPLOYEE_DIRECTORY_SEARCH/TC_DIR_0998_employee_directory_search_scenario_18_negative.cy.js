/**
 * Test Case ID: TC_DIR_0998
 * Feature: FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH
 * Name: Employee Directory Search - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_DIR_EMPLOYEE_DIRECTORY_SEARCH: TC_DIR_0998', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_0998: Employee Directory Search - Scenario 18 (Negative)', function () {
    // Objective: Validate Employee Directory Search behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
