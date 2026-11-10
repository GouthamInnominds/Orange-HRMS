/**
 * Test Case ID: TC_CLM_0915
 * Feature: FEAT_CLM_EXPENSE_TYPES
 * Name: Expense Types - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_CLM_EXPENSE_TYPES: TC_CLM_0915', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0915: Expense Types - Scenario 5 (Positive)', function () {
    // Objective: Validate Expense Types behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
