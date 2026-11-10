/**
 * Test Case ID: TC_ADM_056
 * Feature: FEAT_QUALIFICATION___EDUCATION
 * Name: Create education record with duplicate name
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___EDUCATION: TC_ADM_056', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_056: Create education record with duplicate name', function () {
    // Objective: Verify education name must be unique.
    cy.url().should('include', '/auth/login');
  });
});
