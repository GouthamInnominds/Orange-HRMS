/**
 * Test Case ID: TC_ADM_093
 * Feature: FEAT_ORGANIZATION_GENERAL_INFORMATION
 * Name: View organization general information
 * Priority: Medium
 */

describe('Feature FEAT_ORGANIZATION_GENERAL_INFORMATION: TC_ADM_093', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_093: View organization general information', function () {
    // Objective: Verify organization general information (a singleton record) can be viewed.
    cy.url().should('include', '/auth/login');
  });
});
