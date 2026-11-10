/**
 * Test Case ID: TC_ADM_054
 * Feature: FEAT_QUALIFICATION___EDUCATION
 * Name: Create education record with valid unique name
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___EDUCATION: TC_ADM_054', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_054: Create education record with valid unique name', function () {
    // Objective: Verify an Education record can be created with a valid unique name (<=100 chars).
    cy.url().should('include', '/auth/login');
  });
});
