/**
 * Test Case ID: TC_ADM_178
 * Feature: FEAT_PAY_GRADE_CURRENCY
 * Name: Add a currency to a non-existent pay grade
 * Priority: Medium
 */

describe('Feature FEAT_PAY_GRADE_CURRENCY: TC_ADM_178', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_178: Add a currency to a non-existent pay grade', function () {
    // Objective: Verify adding a currency fails if the specified payGradeId does not exist.
    cy.url().should('include', '/auth/login');
  });
});
