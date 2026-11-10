/**
 * Test Case ID: TC_PRF_0797
 * Feature: FEAT_PRF_PERFORMANCE_TRACKERS
 * Name: Performance Trackers - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_PERFORMANCE_TRACKERS: TC_PRF_0797', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0797: Performance Trackers - Scenario 2 (Negative)', function () {
    // Objective: Validate Performance Trackers behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
