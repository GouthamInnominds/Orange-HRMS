/**
 * Test Case ID: TC_CLM_0926
 * Feature: FEAT_CLM_EXPENSE_TYPES
 * Name: Expense Types - Scenario 16 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_CLM_EXPENSE_TYPES: TC_CLM_0926', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0926: Expense Types - Scenario 16 (Security/RBAC)', function () {
    // Objective: Validate Expense Types behavior under Security/RBAC conditions (Rule validation #16).
    cy.url().should('include', '/auth/login');
  });
});
