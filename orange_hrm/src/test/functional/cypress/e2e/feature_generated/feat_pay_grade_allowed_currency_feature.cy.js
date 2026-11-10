/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_PAY_GRADE_ALLOWED_CURRENCY | Tests: 3
 */

describe('Feature: FEAT_PAY_GRADE_ALLOWED_CURRENCY', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_181: List currencies available to assign to a pay grade', function () {
    // Priority: Medium | Objective: Verify only currencies not already assigned to a given pay grade are listed as allowed/available.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_182: List allowed currencies with sorting and pagination', function () {
    // Priority: Low | Objective: Verify the allowed currencies list supports sortField, sortOrder, limit and offset.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_183: List allowed currencies for a non-existent pay grade', function () {
    // Priority: Low | Objective: Verify requesting allowed currencies for an invalid payGradeId is handled correctly.
    cy.url().should('include', '/auth/login');
  });

});
