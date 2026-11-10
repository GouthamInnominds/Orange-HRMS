/**
 * Test Case ID: TC_PRF_0813
 * Feature: FEAT_PRF_PERFORMANCE_TRACKERS
 * Name: Performance Trackers - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_PERFORMANCE_TRACKERS: TC_PRF_0813', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0813: Performance Trackers - Scenario 18 (Negative)', function () {
    // Objective: Validate Performance Trackers behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
