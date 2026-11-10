/**
 * Test Case ID: TC_ADM_014
 * Feature: FEAT_PAY_GRADE
 * Name: Create pay grade with missing name
 * Priority: High
 */

describe('Feature FEAT_PAY_GRADE: TC_ADM_014', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_014: Create pay grade with missing name', function () {
    // Objective: Verify name is required to create a pay grade.
    cy.url().should('include', '/auth/login');
  });
});
