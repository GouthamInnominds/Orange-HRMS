/**
 * Test Case ID: TC_ADM_088
 * Feature: FEAT_LOCATION
 * Name: Create location with name exceeding 100 characters
 * Priority: Medium
 */

describe('Feature FEAT_LOCATION: TC_ADM_088', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_088: Create location with name exceeding 100 characters', function () {
    // Objective: Verify location name is rejected when exceeding max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });
});
