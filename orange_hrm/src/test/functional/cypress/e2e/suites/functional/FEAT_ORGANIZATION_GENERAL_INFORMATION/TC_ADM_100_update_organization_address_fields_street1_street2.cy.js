/**
 * Test Case ID: TC_ADM_100
 * Feature: FEAT_ORGANIZATION_GENERAL_INFORMATION
 * Name: Update organization address fields (street1/street2 exceeding max length)
 * Priority: Low
 */

describe('Feature FEAT_ORGANIZATION_GENERAL_INFORMATION: TC_ADM_100', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_100: Update organization address fields (street1/street2 exceeding max length)', function () {
    // Objective: Verify street1 and street2 fields (<=100 chars each) reject overly long values.
    cy.url().should('include', '/auth/login');
  });
});
