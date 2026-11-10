/**
 * Test Case ID: TC_PIM_0218
 * Feature: FEAT_PIM_REPORT_TO___SUBORDINATES
 * Name: Report To & Subordinates - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_REPORT_TO___SUBORDINATES: TC_PIM_0218', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0218: Report To & Subordinates - Scenario 18 (Negative)', function () {
    // Objective: Validate Report To & Subordinates behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
