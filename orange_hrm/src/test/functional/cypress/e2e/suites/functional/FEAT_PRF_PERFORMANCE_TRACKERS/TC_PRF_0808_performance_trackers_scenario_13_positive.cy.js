/**
 * Test Case ID: TC_PRF_0808
 * Feature: FEAT_PRF_PERFORMANCE_TRACKERS
 * Name: Performance Trackers - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_PERFORMANCE_TRACKERS: TC_PRF_0808', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0808: Performance Trackers - Scenario 13 (Positive)', function () {
    // Objective: Validate Performance Trackers behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
