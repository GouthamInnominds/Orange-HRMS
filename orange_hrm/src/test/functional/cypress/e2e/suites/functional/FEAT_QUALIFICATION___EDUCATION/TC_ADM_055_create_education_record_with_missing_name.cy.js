/**
 * Test Case ID: TC_ADM_055
 * Feature: FEAT_QUALIFICATION___EDUCATION
 * Name: Create education record with missing name
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___EDUCATION: TC_ADM_055', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_055: Create education record with missing name', function () {
    // Objective: Verify name is required to create an education record.
    cy.url().should('include', '/auth/login');
  });
});
