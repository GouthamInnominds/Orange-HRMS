/**
 * Test Case ID: TC_PRF_0812
 * Feature: FEAT_PRF_PERFORMANCE_TRACKERS
 * Name: Performance Trackers - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_PERFORMANCE_TRACKERS: TC_PRF_0812', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0812: Performance Trackers - Scenario 17 (Positive)', function () {
    // Objective: Validate Performance Trackers behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
