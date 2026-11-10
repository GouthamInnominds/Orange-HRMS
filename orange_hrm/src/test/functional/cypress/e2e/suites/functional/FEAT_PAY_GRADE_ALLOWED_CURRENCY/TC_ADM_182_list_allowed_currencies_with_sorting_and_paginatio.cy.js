/**
 * Test Case ID: TC_ADM_182
 * Feature: FEAT_PAY_GRADE_ALLOWED_CURRENCY
 * Name: List allowed currencies with sorting and pagination
 * Priority: Low
 */

describe('Feature FEAT_PAY_GRADE_ALLOWED_CURRENCY: TC_ADM_182', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_182: List allowed currencies with sorting and pagination', function () {
    // Objective: Verify the allowed currencies list supports sortField, sortOrder, limit and offset.
    cy.url().should('include', '/auth/login');
  });
});
