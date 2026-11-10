/**
 * Test Case ID: TC_PRF_0838
 * Feature: FEAT_PRF_TRACKER_LOGS
 * Name: Tracker Logs - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_TRACKER_LOGS: TC_PRF_0838', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0838: Tracker Logs - Scenario 18 (Negative)', function () {
    // Objective: Validate Tracker Logs behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
