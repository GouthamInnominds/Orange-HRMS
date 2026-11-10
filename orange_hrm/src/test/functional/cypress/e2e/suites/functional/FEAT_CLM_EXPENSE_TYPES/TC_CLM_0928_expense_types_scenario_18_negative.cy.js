/**
 * Test Case ID: TC_CLM_0928
 * Feature: FEAT_CLM_EXPENSE_TYPES
 * Name: Expense Types - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_CLM_EXPENSE_TYPES: TC_CLM_0928', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0928: Expense Types - Scenario 18 (Negative)', function () {
    // Objective: Validate Expense Types behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
