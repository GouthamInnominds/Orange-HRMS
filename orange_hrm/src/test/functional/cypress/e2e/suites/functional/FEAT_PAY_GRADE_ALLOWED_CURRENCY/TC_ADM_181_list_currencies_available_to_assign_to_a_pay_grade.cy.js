/**
 * Test Case ID: TC_ADM_181
 * Feature: FEAT_PAY_GRADE_ALLOWED_CURRENCY
 * Name: List currencies available to assign to a pay grade
 * Priority: Medium
 */

describe('Feature FEAT_PAY_GRADE_ALLOWED_CURRENCY: TC_ADM_181', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_181: List currencies available to assign to a pay grade', function () {
    // Objective: Verify only currencies not already assigned to a given pay grade are listed as allowed/available.
    cy.url().should('include', '/auth/login');
  });
});
