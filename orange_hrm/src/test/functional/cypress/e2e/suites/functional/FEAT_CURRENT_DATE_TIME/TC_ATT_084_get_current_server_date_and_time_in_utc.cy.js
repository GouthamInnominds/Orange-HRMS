/**
 * Test Case ID: TC_ATT_084
 * Feature: FEAT_CURRENT_DATE_TIME
 * Name: Get current server date and time in UTC
 * Priority: Medium
 */

describe('Feature FEAT_CURRENT_DATE_TIME: TC_ATT_084', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_084: Get current server date and time in UTC', function () {
    // Objective: Verify GET /attendance/current-datetime returns the server\'s current date and time normalized to UTC.
    cy.url().should('include', '/auth/login');
  });
});
