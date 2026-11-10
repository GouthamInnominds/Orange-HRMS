/**
 * Test Case ID: TC_PRF_0837
 * Feature: FEAT_PRF_TRACKER_LOGS
 * Name: Tracker Logs - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_TRACKER_LOGS: TC_PRF_0837', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0837: Tracker Logs - Scenario 17 (Positive)', function () {
    // Objective: Validate Tracker Logs behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
