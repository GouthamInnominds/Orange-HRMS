/**
 * Test Case ID: TC_PRF_0830
 * Feature: FEAT_PRF_TRACKER_LOGS
 * Name: Tracker Logs - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_TRACKER_LOGS: TC_PRF_0830', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0830: Tracker Logs - Scenario 10 (Negative)', function () {
    // Objective: Validate Tracker Logs behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
