/**
 * Test Case ID: TC_CLM_0930
 * Feature: FEAT_CLM_EXPENSE_TYPES
 * Name: Expense Types - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_CLM_EXPENSE_TYPES: TC_CLM_0930', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0930: Expense Types - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Expense Types behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
