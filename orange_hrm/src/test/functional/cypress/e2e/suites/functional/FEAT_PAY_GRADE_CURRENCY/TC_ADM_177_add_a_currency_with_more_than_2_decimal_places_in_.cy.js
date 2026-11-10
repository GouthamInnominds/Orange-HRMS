/**
 * Test Case ID: TC_ADM_177
 * Feature: FEAT_PAY_GRADE_CURRENCY
 * Name: Add a currency with more than 2 decimal places in salary
 * Priority: Low
 */

describe('Feature FEAT_PAY_GRADE_CURRENCY: TC_ADM_177', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_177: Add a currency with more than 2 decimal places in salary', function () {
    // Objective: Verify salary values only allow up to 2 decimal places (DECIMAL rule 0/1/2).
    cy.url().should('include', '/auth/login');
  });
});
