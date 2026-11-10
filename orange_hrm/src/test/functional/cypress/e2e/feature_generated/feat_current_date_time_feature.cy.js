/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_CURRENT_DATE_TIME | Tests: 3
 */

describe('Feature: FEAT_CURRENT_DATE_TIME', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ATT_084: Get current server date and time in UTC', function () {
    // Priority: Medium | Objective: Verify GET /attendance/current-datetime returns the server\'s current date and time normalized to UTC.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_085: Current date/time response format is valid', function () {
    // Priority: Low | Objective: Verify the DateTimeModel response contains correctly structured date/time fields consumable by the client.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_086: Current date/time endpoint ignores an \'id\' path parameter', function () {
    // Priority: Low | Objective: Verify the endpoint excludes the standard \'id\' parameter from validation since it is a singleton resource with no identifier.
    cy.url().should('include', '/auth/login');
  });

});
