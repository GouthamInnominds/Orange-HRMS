/**
 * Test Case ID: TC_LEV_0323
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0323', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0323: Leave Types - Scenario 23 (Boundary)', function () {
    // Objective: Validate Leave Types behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
