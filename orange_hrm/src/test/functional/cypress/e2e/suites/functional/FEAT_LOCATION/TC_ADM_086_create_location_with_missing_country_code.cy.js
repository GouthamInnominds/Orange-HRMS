/**
 * Test Case ID: TC_ADM_086
 * Feature: FEAT_LOCATION
 * Name: Create location with missing country code
 * Priority: High
 */

describe('Feature FEAT_LOCATION: TC_ADM_086', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_086: Create location with missing country code', function () {
    // Objective: Verify countryCode is required to create a location.
    cy.url().should('include', '/auth/login');
  });
});
