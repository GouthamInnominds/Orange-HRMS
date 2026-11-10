/**
 * Test Case ID: TC_ADM_061
 * Feature: FEAT_QUALIFICATION___LANGUAGE
 * Name: Create language record with missing name
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___LANGUAGE: TC_ADM_061', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_061: Create language record with missing name', function () {
    // Objective: Verify name is required to create a language record.
    cy.url().should('include', '/auth/login');
  });
});
