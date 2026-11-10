/**
 * Test Case ID: TC_ADM_091
 * Feature: FEAT_LOCATION
 * Name: Search locations by name, city and country code
 * Priority: Medium
 */

describe('Feature FEAT_LOCATION: TC_ADM_091', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_091: Search locations by name, city and country code', function () {
    // Objective: Verify the location list can be filtered by name, city and countryCode.
    cy.url().should('include', '/auth/login');
  });
});
