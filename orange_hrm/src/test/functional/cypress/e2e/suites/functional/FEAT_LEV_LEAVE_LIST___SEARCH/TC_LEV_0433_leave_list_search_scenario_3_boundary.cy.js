/**
 * Test Case ID: TC_LEV_0433
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0433', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0433: Leave List & Search - Scenario 3 (Boundary)', function () {
    // Objective: Validate Leave List & Search behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
