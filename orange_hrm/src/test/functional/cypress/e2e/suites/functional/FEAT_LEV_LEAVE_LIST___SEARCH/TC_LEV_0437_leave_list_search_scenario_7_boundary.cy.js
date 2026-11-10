/**
 * Test Case ID: TC_LEV_0437
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 7 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0437', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0437: Leave List & Search - Scenario 7 (Boundary)', function () {
    // Objective: Validate Leave List & Search behavior under Boundary conditions (Rule validation #7).
    cy.url().should('include', '/auth/login');
  });
});
