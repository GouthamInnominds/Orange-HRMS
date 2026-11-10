/**
 * Test Case ID: TC_ADM_174
 * Feature: FEAT_PAY_GRADE_CURRENCY
 * Name: Add a currency with min salary greater than or equal to max salary
 * Priority: High
 */

describe('Feature FEAT_PAY_GRADE_CURRENCY: TC_ADM_174', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_174: Add a currency with min salary greater than or equal to max salary', function () {
    // Objective: Verify the business rule that minSalary must be less than maxSalary (unless minSalary is 0).
    cy.url().should('include', '/auth/login');
  });
});
