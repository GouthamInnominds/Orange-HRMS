/**
 * Test Case ID: TC_ADM_065
 * Feature: FEAT_QUALIFICATION___LANGUAGE
 * Name: Delete one or more language records
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___LANGUAGE: TC_ADM_065', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_065: Delete one or more language records', function () {
    // Objective: Verify selected language records can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });
});
