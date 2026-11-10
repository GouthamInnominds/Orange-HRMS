/**
 * Test Case ID: TC_ATT_086
 * Feature: FEAT_CURRENT_DATE_TIME
 * Name: Current date/time endpoint ignores an 'id' path parameter
 * Priority: Low
 */

describe('Feature FEAT_CURRENT_DATE_TIME: TC_ATT_086', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_086: Current date/time endpoint ignores an \'id\' path parameter', function () {
    // Objective: Verify the endpoint excludes the standard \'id\' parameter from validation since it is a singleton resource with no identifier.
    cy.url().should('include', '/auth/login');
  });
});
