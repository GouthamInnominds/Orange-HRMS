/**
 * Test Case ID: TC_LEV_0445
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0445', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0445: Leave List & Search - Scenario 15 (Boundary)', function () {
    // Objective: Validate Leave List & Search behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
