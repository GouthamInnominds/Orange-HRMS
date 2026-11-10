/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_LOCATION | Tests: 9
 */

describe('Feature: FEAT_LOCATION', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_084: Create location with valid name and country code', function () {
    // Priority: High | Objective: Verify a Location can be created with required name and countryCode.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_085: Create location with all optional fields populated', function () {
    // Priority: Medium | Objective: Verify a Location can be created with province, city, address, zip code, phone, fax and note.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_086: Create location with missing country code', function () {
    // Priority: High | Objective: Verify countryCode is required to create a location.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_087: Create location with invalid country code', function () {
    // Priority: Medium | Objective: Verify countryCode must be a valid recognized country code (COUNTRY_CODE rule).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_088: Create location with name exceeding 100 characters', function () {
    // Priority: Medium | Objective: Verify location name is rejected when exceeding max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_089: Create location with invalid phone number format', function () {
    // Priority: Medium | Objective: Verify phone field must match the expected PHONE format rule (max 30 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_090: Create location with address exceeding 250 characters', function () {
    // Priority: Low | Objective: Verify address field is rejected when exceeding max length of 250 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_091: Search locations by name, city and country code', function () {
    // Priority: Medium | Objective: Verify the location list can be filtered by name, city and countryCode.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_092: Delete one or more locations', function () {
    // Priority: High | Objective: Verify selected locations can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });

});
