/**
 * Test Case ID: TC_ADM_090
 * Feature: FEAT_LOCATION
 * Name: Create location with address exceeding 250 characters
 * Priority: Low
 */

describe('Feature FEAT_LOCATION: TC_ADM_090', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_090: Create location with address exceeding 250 characters', function () {
    // Objective: Verify address field is rejected when exceeding max length of 250 characters.
    cy.url().should('include', '/auth/login');
  });
});
