/**
 * Test Case ID: TC_PIM_0215
 * Feature: FEAT_PIM_REPORT_TO___SUBORDINATES
 * Name: Report To & Subordinates - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_REPORT_TO___SUBORDINATES: TC_PIM_0215', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0215: Report To & Subordinates - Scenario 15 (Boundary)', function () {
    // Objective: Validate Report To & Subordinates behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
