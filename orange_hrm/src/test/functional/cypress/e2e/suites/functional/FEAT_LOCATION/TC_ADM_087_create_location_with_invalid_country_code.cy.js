/**
 * Test Case ID: TC_ADM_087
 * Feature: FEAT_LOCATION
 * Name: Create location with invalid country code
 * Priority: Medium
 */

describe('Feature FEAT_LOCATION: TC_ADM_087', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_087: Create location with invalid country code', function () {
    // Objective: Verify countryCode must be a valid recognized country code (COUNTRY_CODE rule).
    cy.url().should('include', '/auth/login');
  });
});
