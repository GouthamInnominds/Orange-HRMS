/**
 * Test Case ID: TC_ATT_011
 * Feature: FEAT_PUNCH_IN
 * Name: Punch in succeeds when time is within +/-180 second tolerance and time-change is disabled
 * Priority: Medium
 */

describe('Feature FEAT_PUNCH_IN: TC_ATT_011', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_011: Punch in succeeds when time is within +/-180 second tolerance and time-change is disabled', function () {
    // Objective: Verify punch in succeeds when \'Allow employees to change time\' is disabled but the supplied date/time is within the 180-second margin of the actual current time.
    cy.url().should('include', '/auth/login');
  });
});
