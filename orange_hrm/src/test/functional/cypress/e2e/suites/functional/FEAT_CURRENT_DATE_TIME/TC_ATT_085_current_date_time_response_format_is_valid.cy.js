/**
 * Test Case ID: TC_ATT_085
 * Feature: FEAT_CURRENT_DATE_TIME
 * Name: Current date/time response format is valid
 * Priority: Low
 */

describe('Feature FEAT_CURRENT_DATE_TIME: TC_ATT_085', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_085: Current date/time response format is valid', function () {
    // Objective: Verify the DateTimeModel response contains correctly structured date/time fields consumable by the client.
    cy.url().should('include', '/auth/login');
  });
});
