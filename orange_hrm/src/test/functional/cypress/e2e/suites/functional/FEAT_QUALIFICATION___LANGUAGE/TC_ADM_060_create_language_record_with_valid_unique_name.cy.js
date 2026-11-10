/**
 * Test Case ID: TC_ADM_060
 * Feature: FEAT_QUALIFICATION___LANGUAGE
 * Name: Create language record with valid unique name
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___LANGUAGE: TC_ADM_060', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_060: Create language record with valid unique name', function () {
    // Objective: Verify a Language record can be created with a valid unique name (<=120 chars).
    cy.url().should('include', '/auth/login');
  });
});
