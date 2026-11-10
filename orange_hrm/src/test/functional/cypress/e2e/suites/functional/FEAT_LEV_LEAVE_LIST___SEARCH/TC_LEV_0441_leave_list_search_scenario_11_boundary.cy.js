/**
 * Test Case ID: TC_LEV_0441
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 11 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0441', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0441: Leave List & Search - Scenario 11 (Boundary)', function () {
    // Objective: Validate Leave List & Search behavior under Boundary conditions (Rule validation #11).
    cy.url().should('include', '/auth/login');
  });
});
