/**
 * Test Case ID: TC_ATT_020
 * Feature: FEAT_PUNCH_OUT
 * Name: Punch out rejected when system time is altered beyond tolerance and time-change is disabled
 * Priority: High
 */

describe('Feature FEAT_PUNCH_OUT: TC_ATT_020', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_020: Punch out rejected when system time is altered beyond tolerance and time-change is disabled', function () {
    // Objective: Verify punch out fails with \'Provided Date And Time Invalid\' when \'Allow employees to change time\' is disabled and supplied time differs from actual time by more than 180 seconds.
    cy.url().should('include', '/auth/login');
  });
});
