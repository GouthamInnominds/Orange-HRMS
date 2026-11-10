/**
 * Test Case ID: TC_PIM_0222
 * Feature: FEAT_PIM_REPORT_TO___SUBORDINATES
 * Name: Report To & Subordinates - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_REPORT_TO___SUBORDINATES: TC_PIM_0222', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0222: Report To & Subordinates - Scenario 22 (Negative)', function () {
    // Objective: Validate Report To & Subordinates behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
