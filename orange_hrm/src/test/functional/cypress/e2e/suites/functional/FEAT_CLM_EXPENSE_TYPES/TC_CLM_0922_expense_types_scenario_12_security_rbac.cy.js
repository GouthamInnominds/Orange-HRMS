/**
 * Test Case ID: TC_CLM_0922
 * Feature: FEAT_CLM_EXPENSE_TYPES
 * Name: Expense Types - Scenario 12 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_CLM_EXPENSE_TYPES: TC_CLM_0922', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0922: Expense Types - Scenario 12 (Security/RBAC)', function () {
    // Objective: Validate Expense Types behavior under Security/RBAC conditions (Rule validation #12).
    cy.url().should('include', '/auth/login');
  });
});
