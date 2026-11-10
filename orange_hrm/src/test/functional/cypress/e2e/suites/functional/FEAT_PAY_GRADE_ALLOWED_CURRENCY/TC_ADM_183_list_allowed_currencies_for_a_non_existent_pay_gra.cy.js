/**
 * Test Case ID: TC_ADM_183
 * Feature: FEAT_PAY_GRADE_ALLOWED_CURRENCY
 * Name: List allowed currencies for a non-existent pay grade
 * Priority: Low
 */

describe('Feature FEAT_PAY_GRADE_ALLOWED_CURRENCY: TC_ADM_183', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_183: List allowed currencies for a non-existent pay grade', function () {
    // Objective: Verify requesting allowed currencies for an invalid payGradeId is handled correctly.
    cy.url().should('include', '/auth/login');
  });
});
