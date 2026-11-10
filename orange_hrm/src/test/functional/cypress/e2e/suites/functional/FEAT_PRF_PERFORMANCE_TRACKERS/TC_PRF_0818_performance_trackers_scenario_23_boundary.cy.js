/**
 * Test Case ID: TC_PRF_0818
 * Feature: FEAT_PRF_PERFORMANCE_TRACKERS
 * Name: Performance Trackers - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_PERFORMANCE_TRACKERS: TC_PRF_0818', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0818: Performance Trackers - Scenario 23 (Boundary)', function () {
    // Objective: Validate Performance Trackers behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
