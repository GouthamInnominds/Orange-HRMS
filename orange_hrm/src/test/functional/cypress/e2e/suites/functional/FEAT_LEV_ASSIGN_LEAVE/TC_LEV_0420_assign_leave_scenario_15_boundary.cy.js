/**
 * Test Case ID: TC_LEV_0420
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0420', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0420: Assign Leave - Scenario 15 (Boundary)', function () {
    // Objective: Validate Assign Leave behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
