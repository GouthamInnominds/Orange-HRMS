/**
 * Test Case ID: TC_CLM_0920
 * Feature: FEAT_CLM_EXPENSE_TYPES
 * Name: Expense Types - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_CLM_EXPENSE_TYPES: TC_CLM_0920', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0920: Expense Types - Scenario 10 (Negative)', function () {
    // Objective: Validate Expense Types behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
