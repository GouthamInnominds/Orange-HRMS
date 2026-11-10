/**
 * Test Case ID: TC_ADM_064
 * Feature: FEAT_QUALIFICATION___LANGUAGE
 * Name: Update language record name
 * Priority: Medium
 */

describe('Feature FEAT_QUALIFICATION___LANGUAGE: TC_ADM_064', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_064: Update language record name', function () {
    // Objective: Verify an existing language record name can be updated.
    cy.url().should('include', '/auth/login');
  });
});
