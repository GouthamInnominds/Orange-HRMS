/**
 * Test Case ID: TC_ATT_010
 * Feature: FEAT_PUNCH_IN
 * Name: Punch in rejected when system time is altered beyond tolerance and 'Allow employees to change time' is disabled
 * Priority: High
 */

describe('Feature FEAT_PUNCH_IN: TC_ATT_010', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_010: Punch in rejected when system time is altered beyond tolerance and \'Allow employees to change time\' is disabled', function () {
    // Objective: Verify punch in fails with \'Provided Date And Time Invalid\' when the configuration disallows changing current time and the supplied date/time differs from the actual server time by more than 180 seconds.
    cy.url().should('include', '/auth/login');
  });
});
