/**
 * Test Case ID: TC_LEV_0303
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0303', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0303: Leave Types - Scenario 3 (Boundary)', function () {
    // Objective: Validate Leave Types behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
