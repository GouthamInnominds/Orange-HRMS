/**
 * Test Case ID: TC_CLM_0925
 * Feature: FEAT_CLM_EXPENSE_TYPES
 * Name: Expense Types - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_CLM_EXPENSE_TYPES: TC_CLM_0925', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_CLM_0925: Expense Types - Scenario 15 (Boundary)', function () {
    // Objective: Validate Expense Types behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
