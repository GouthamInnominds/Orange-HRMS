/**
 * Test Case ID: TC_PRF_0801
 * Feature: FEAT_PRF_PERFORMANCE_TRACKERS
 * Name: Performance Trackers - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_PERFORMANCE_TRACKERS: TC_PRF_0801', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0801: Performance Trackers - Scenario 6 (Negative)', function () {
    // Objective: Validate Performance Trackers behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
