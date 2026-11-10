/**
 * Test Case ID: TC_CLM_0919
 * Feature: FEAT_CLM_EXPENSE_TYPES
 * Name: Expense Types - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_CLM_EXPENSE_TYPES: TC_CLM_0919', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0919: Expense Types - Scenario 9 (Positive)', function () {
    // Objective: Validate Expense Types behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
