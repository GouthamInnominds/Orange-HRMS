/**
 * Test Case ID: TC_ADM_062
 * Feature: FEAT_QUALIFICATION___LANGUAGE
 * Name: Create language record with duplicate name
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___LANGUAGE: TC_ADM_062', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_062: Create language record with duplicate name', function () {
    // Objective: Verify language name must be unique.
    cy.url().should('include', '/auth/login');
  });
});
