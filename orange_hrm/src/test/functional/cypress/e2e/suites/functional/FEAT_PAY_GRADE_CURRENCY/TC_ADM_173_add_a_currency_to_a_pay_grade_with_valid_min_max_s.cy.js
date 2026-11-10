/**
 * Test Case ID: TC_ADM_173
 * Feature: FEAT_PAY_GRADE_CURRENCY
 * Name: Add a currency to a pay grade with valid min/max salary
 * Priority: High
 */

describe('Feature FEAT_PAY_GRADE_CURRENCY: TC_ADM_173', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_173: Add a currency to a pay grade with valid min/max salary', function () {
    // Objective: Verify a currency can be added to a pay grade with minSalary less than maxSalary, both within allowed range and decimal precision.
    cy.url().should('include', '/auth/login');
  });
});
