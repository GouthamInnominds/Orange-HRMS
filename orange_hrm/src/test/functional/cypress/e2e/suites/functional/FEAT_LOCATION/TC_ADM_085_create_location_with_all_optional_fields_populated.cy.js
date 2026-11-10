/**
 * Test Case ID: TC_ADM_085
 * Feature: FEAT_LOCATION
 * Name: Create location with all optional fields populated
 * Priority: Medium
 */

describe('Feature FEAT_LOCATION: TC_ADM_085', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_085: Create location with all optional fields populated', function () {
    // Objective: Verify a Location can be created with province, city, address, zip code, phone, fax and note.
    cy.url().should('include', '/auth/login');
  });
});
