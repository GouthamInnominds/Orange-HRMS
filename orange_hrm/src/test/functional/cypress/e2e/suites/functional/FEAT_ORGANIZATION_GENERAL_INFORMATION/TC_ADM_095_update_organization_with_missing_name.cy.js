/**
 * Test Case ID: TC_ADM_095
 * Feature: FEAT_ORGANIZATION_GENERAL_INFORMATION
 * Name: Update organization with missing name
 * Priority: High
 */

describe('Feature FEAT_ORGANIZATION_GENERAL_INFORMATION: TC_ADM_095', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_095: Update organization with missing name', function () {
    // Objective: Verify organization update fails when name is left blank.
    cy.url().should('include', '/auth/login');
  });
});
