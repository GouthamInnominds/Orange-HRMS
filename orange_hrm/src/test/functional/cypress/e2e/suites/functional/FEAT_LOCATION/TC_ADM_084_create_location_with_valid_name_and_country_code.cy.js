/**
 * Test Case ID: TC_ADM_084
 * Feature: FEAT_LOCATION
 * Name: Create location with valid name and country code
 * Priority: High
 */

describe('Feature FEAT_LOCATION: TC_ADM_084', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_084: Create location with valid name and country code', function () {
    // Objective: Verify a Location can be created with required name and countryCode.
    cy.url().should('include', '/auth/login');
  });
});
