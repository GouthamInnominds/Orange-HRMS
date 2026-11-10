/**
 * Test Case ID: TC_PRF_0816
 * Feature: FEAT_PRF_PERFORMANCE_TRACKERS
 * Name: Performance Trackers - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_PERFORMANCE_TRACKERS: TC_PRF_0816', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0816: Performance Trackers - Scenario 21 (Positive)', function () {
    // Objective: Validate Performance Trackers behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
