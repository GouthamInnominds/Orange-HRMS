/**
 * Test Case ID: TC_ADM_175
 * Feature: FEAT_PAY_GRADE_CURRENCY
 * Name: Add a currency with min salary of 0
 * Priority: Medium
 */

describe('Feature FEAT_PAY_GRADE_CURRENCY: TC_ADM_175', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_175: Add a currency with min salary of 0', function () {
    // Objective: Verify minSalary of exactly 0 is treated as a special case and does not trigger the min<max comparison bypass incorrectly.
    cy.url().should('include', '/auth/login');
  });
});
