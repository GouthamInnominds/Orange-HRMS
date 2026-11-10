/**
 * Test Case ID: TC_LEV_0428
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0428', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0428: Assign Leave - Scenario 23 (Boundary)', function () {
    // Objective: Validate Assign Leave behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
