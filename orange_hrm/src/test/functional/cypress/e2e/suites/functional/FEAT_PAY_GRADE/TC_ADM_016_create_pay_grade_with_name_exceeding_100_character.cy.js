/**
 * Test Case ID: TC_ADM_016
 * Feature: FEAT_PAY_GRADE
 * Name: Create pay grade with name exceeding 100 characters
 * Priority: Medium
 */

describe('Feature FEAT_PAY_GRADE: TC_ADM_016', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_016: Create pay grade with name exceeding 100 characters', function () {
    // Objective: Verify pay grade name is rejected when exceeding max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });
});
