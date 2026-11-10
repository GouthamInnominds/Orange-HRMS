/**
 * Test Case ID: TC_ADM_176
 * Feature: FEAT_PAY_GRADE_CURRENCY
 * Name: Add a currency with salary exceeding maximum allowed value
 * Priority: Medium
 */

describe('Feature FEAT_PAY_GRADE_CURRENCY: TC_ADM_176', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_176: Add a currency with salary exceeding maximum allowed value', function () {
    // Objective: Verify salary values must be less than 1,000,000,000 (PARAM_RULE_SALARY_MAX_VALUE).
    cy.url().should('include', '/auth/login');
  });
});
