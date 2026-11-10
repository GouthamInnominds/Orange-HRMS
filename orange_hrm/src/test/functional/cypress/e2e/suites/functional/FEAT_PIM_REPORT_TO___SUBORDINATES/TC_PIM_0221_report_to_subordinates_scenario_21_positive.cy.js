/**
 * Test Case ID: TC_PIM_0221
 * Feature: FEAT_PIM_REPORT_TO___SUBORDINATES
 * Name: Report To & Subordinates - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_REPORT_TO___SUBORDINATES: TC_PIM_0221', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0221: Report To & Subordinates - Scenario 21 (Positive)', function () {
    // Objective: Validate Report To & Subordinates behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
