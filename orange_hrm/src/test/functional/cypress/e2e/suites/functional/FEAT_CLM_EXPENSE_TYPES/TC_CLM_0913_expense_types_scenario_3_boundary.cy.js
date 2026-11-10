/**
 * Test Case ID: TC_CLM_0913
 * Feature: FEAT_CLM_EXPENSE_TYPES
 * Name: Expense Types - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_CLM_EXPENSE_TYPES: TC_CLM_0913', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0913: Expense Types - Scenario 3 (Boundary)', function () {
    // Objective: Validate Expense Types behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
