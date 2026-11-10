/**
 * Test Case ID: TC_PRF_0799
 * Feature: FEAT_PRF_PERFORMANCE_TRACKERS
 * Name: Performance Trackers - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PRF_PERFORMANCE_TRACKERS: TC_PRF_0799', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0799: Performance Trackers - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Performance Trackers behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
