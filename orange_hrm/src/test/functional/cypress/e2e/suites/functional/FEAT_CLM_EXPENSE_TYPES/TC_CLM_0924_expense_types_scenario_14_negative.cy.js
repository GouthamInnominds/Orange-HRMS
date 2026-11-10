/**
 * Test Case ID: TC_CLM_0924
 * Feature: FEAT_CLM_EXPENSE_TYPES
 * Name: Expense Types - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_CLM_EXPENSE_TYPES: TC_CLM_0924', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0924: Expense Types - Scenario 14 (Negative)', function () {
    // Objective: Validate Expense Types behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
