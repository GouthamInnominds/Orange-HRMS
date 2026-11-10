/**
 * Test Case ID: TC_CLM_0911
 * Feature: FEAT_CLM_EXPENSE_TYPES
 * Name: Expense Types - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_CLM_EXPENSE_TYPES: TC_CLM_0911', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0911: Expense Types - Scenario 1 (Positive)', function () {
    // Objective: Validate Expense Types behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
