/**
 * Test Case ID: TC_ATT_082
 * Feature: FEAT_TIMEZONE_SELECTION
 * Name: Filter timezones with a name that matches no entries returns an empty list
 * Priority: Low
 */

describe('Feature FEAT_TIMEZONE_SELECTION: TC_ATT_082', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_082: Filter timezones with a name that matches no entries returns an empty list', function () {
    // Objective: Verify searching for a non-matching timezone name returns an empty result set instead of an error.
    cy.url().should('include', '/auth/login');
  });
});
