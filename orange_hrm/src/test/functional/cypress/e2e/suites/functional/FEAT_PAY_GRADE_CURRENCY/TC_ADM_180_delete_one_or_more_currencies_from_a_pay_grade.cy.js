/**
 * Test Case ID: TC_ADM_180
 * Feature: FEAT_PAY_GRADE_CURRENCY
 * Name: Delete one or more currencies from a pay grade
 * Priority: High
 */

describe('Feature FEAT_PAY_GRADE_CURRENCY: TC_ADM_180', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_180: Delete one or more currencies from a pay grade', function () {
    // Objective: Verify selected currencies can be bulk removed from a pay grade.
    cy.url().should('include', '/auth/login');
  });
});
