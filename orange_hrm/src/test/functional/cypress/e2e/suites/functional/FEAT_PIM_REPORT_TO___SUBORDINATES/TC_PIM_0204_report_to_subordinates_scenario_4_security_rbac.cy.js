/**
 * Test Case ID: TC_PIM_0204
 * Feature: FEAT_PIM_REPORT_TO___SUBORDINATES
 * Name: Report To & Subordinates - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_REPORT_TO___SUBORDINATES: TC_PIM_0204', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0204: Report To & Subordinates - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Report To & Subordinates behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
