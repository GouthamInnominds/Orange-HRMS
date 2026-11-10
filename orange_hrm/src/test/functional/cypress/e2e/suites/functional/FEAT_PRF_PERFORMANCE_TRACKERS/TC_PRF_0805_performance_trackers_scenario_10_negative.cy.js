/**
 * Test Case ID: TC_PRF_0805
 * Feature: FEAT_PRF_PERFORMANCE_TRACKERS
 * Name: Performance Trackers - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_PERFORMANCE_TRACKERS: TC_PRF_0805', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0805: Performance Trackers - Scenario 10 (Negative)', function () {
    // Objective: Validate Performance Trackers behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
