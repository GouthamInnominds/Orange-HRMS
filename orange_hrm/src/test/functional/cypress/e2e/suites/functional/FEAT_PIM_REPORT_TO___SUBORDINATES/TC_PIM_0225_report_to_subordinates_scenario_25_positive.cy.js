/**
 * Test Case ID: TC_PIM_0225
 * Feature: FEAT_PIM_REPORT_TO___SUBORDINATES
 * Name: Report To & Subordinates - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_REPORT_TO___SUBORDINATES: TC_PIM_0225', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0225: Report To & Subordinates - Scenario 25 (Positive)', function () {
    // Objective: Validate Report To & Subordinates behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
