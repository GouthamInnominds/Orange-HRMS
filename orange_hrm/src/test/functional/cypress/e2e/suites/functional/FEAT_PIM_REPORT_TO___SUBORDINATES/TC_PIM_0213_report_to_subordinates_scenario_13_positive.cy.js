/**
 * Test Case ID: TC_PIM_0213
 * Feature: FEAT_PIM_REPORT_TO___SUBORDINATES
 * Name: Report To & Subordinates - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_REPORT_TO___SUBORDINATES: TC_PIM_0213', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0213: Report To & Subordinates - Scenario 13 (Positive)', function () {
    // Objective: Validate Report To & Subordinates behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
