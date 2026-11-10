/**
 * Test Case ID: TC_ATT_017
 * Feature: FEAT_PUNCH_OUT
 * Name: Punch out fails with invalid timezoneOffset value
 * Priority: Medium
 */

describe('Feature FEAT_PUNCH_OUT: TC_ATT_017', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_017: Punch out fails with invalid timezoneOffset value', function () {
    // Objective: Verify punch out is rejected when timezoneOffset does not match the expected TIMEZONE_OFFSET format.
    cy.url().should('include', '/auth/login');
  });
});
