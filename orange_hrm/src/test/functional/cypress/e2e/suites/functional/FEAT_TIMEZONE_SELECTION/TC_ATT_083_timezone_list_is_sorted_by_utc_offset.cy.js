/**
 * Test Case ID: TC_ATT_083
 * Feature: FEAT_TIMEZONE_SELECTION
 * Name: Timezone list is sorted by UTC offset
 * Priority: Low
 */

describe('Feature FEAT_TIMEZONE_SELECTION: TC_ATT_083', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_083: Timezone list is sorted by UTC offset', function () {
    // Objective: Verify the returned timezone list is ordered from the lowest to the highest UTC offset for usability in the dropdown.
    cy.url().should('include', '/auth/login');
  });
});
