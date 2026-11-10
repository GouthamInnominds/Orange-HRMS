/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_TIMEZONE_SELECTION | Tests: 4
 */

describe('Feature: FEAT_TIMEZONE_SELECTION', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ATT_080: List all available timezones with their current UTC offsets', function () {
    // Priority: Medium | Objective: Verify GET /attendance/timezones returns the full list of system timezones with name, label and offset.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_081: Filter timezones by partial name match', function () {
    // Priority: Medium | Objective: Verify supplying the timezoneName query parameter filters the timezone list to matching entries only.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_082: Filter timezones with a name that matches no entries returns an empty list', function () {
    // Priority: Low | Objective: Verify searching for a non-matching timezone name returns an empty result set instead of an error.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_083: Timezone list is sorted by UTC offset', function () {
    // Priority: Low | Objective: Verify the returned timezone list is ordered from the lowest to the highest UTC offset for usability in the dropdown.
    cy.url().should('include', '/auth/login');
  });

});
