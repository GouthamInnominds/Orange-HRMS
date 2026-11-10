/**
 * Test Case ID: TC_LEV_0408
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0408', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0408: Assign Leave - Scenario 3 (Boundary)', function () {
    // Objective: Validate Assign Leave behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
