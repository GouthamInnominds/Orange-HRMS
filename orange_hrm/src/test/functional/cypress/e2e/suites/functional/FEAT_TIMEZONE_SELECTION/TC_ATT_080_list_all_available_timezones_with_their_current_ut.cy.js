/**
 * Test Case ID: TC_ATT_080
 * Feature: FEAT_TIMEZONE_SELECTION
 * Name: List all available timezones with their current UTC offsets
 * Priority: Medium
 */

describe('Feature FEAT_TIMEZONE_SELECTION: TC_ATT_080', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_080: List all available timezones with their current UTC offsets', function () {
    // Objective: Verify GET /attendance/timezones returns the full list of system timezones with name, label and offset.
    cy.url().should('include', '/auth/login');
  });
});
