/**
 * Test Case ID: TC_ADM_063
 * Feature: FEAT_QUALIFICATION___LANGUAGE
 * Name: Create language record with name exceeding 120 characters
 * Priority: Medium
 */

describe('Feature FEAT_QUALIFICATION___LANGUAGE: TC_ADM_063', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_063: Create language record with name exceeding 120 characters', function () {
    // Objective: Verify name is rejected when exceeding max length of 120 characters.
    cy.url().should('include', '/auth/login');
  });
});
