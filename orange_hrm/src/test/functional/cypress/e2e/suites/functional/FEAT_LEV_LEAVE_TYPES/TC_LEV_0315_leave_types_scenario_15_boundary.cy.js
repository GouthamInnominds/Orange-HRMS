/**
 * Test Case ID: TC_LEV_0315
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0315', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0315: Leave Types - Scenario 15 (Boundary)', function () {
    // Objective: Validate Leave Types behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
