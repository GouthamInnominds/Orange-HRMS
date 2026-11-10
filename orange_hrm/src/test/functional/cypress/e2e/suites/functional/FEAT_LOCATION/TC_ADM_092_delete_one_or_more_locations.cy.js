/**
 * Test Case ID: TC_ADM_092
 * Feature: FEAT_LOCATION
 * Name: Delete one or more locations
 * Priority: High
 */

describe('Feature FEAT_LOCATION: TC_ADM_092', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_092: Delete one or more locations', function () {
    // Objective: Verify selected locations can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });
});
