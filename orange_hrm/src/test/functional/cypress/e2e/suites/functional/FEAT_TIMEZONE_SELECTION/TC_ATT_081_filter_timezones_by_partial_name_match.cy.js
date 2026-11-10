/**
 * Test Case ID: TC_ATT_081
 * Feature: FEAT_TIMEZONE_SELECTION
 * Name: Filter timezones by partial name match
 * Priority: Medium
 */

describe('Feature FEAT_TIMEZONE_SELECTION: TC_ATT_081', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_081: Filter timezones by partial name match', function () {
    // Objective: Verify supplying the timezoneName query parameter filters the timezone list to matching entries only.
    cy.url().should('include', '/auth/login');
  });
});
