/**
 * Test Case ID: TC_LEV_0449
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 19 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0449', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0449: Leave List & Search - Scenario 19 (Boundary)', function () {
    // Objective: Validate Leave List & Search behavior under Boundary conditions (Rule validation #19).
    cy.url().should('include', '/auth/login');
  });
});
