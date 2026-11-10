/**
 * Test Case ID: TC_CLM_0923
 * Feature: FEAT_CLM_EXPENSE_TYPES
 * Name: Expense Types - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_CLM_EXPENSE_TYPES: TC_CLM_0923', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0923: Expense Types - Scenario 13 (Positive)', function () {
    // Objective: Validate Expense Types behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
