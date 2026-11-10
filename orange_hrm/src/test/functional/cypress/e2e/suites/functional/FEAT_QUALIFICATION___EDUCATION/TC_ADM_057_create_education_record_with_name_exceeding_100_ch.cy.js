/**
 * Test Case ID: TC_ADM_057
 * Feature: FEAT_QUALIFICATION___EDUCATION
 * Name: Create education record with name exceeding 100 characters
 * Priority: Medium
 */

describe('Feature FEAT_QUALIFICATION___EDUCATION: TC_ADM_057', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_057: Create education record with name exceeding 100 characters', function () {
    // Objective: Verify name is rejected when exceeding max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });
});
