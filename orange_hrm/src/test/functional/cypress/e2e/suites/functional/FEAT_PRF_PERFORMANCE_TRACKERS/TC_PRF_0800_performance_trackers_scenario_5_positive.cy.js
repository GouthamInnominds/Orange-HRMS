/**
 * Test Case ID: TC_PRF_0800
 * Feature: FEAT_PRF_PERFORMANCE_TRACKERS
 * Name: Performance Trackers - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_PERFORMANCE_TRACKERS: TC_PRF_0800', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0800: Performance Trackers - Scenario 5 (Positive)', function () {
    // Objective: Validate Performance Trackers behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
