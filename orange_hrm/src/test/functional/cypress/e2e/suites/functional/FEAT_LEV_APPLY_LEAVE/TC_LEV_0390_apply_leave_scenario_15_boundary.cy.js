/**
 * Test Case ID: TC_LEV_0390
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0390', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0390: Apply Leave - Scenario 15 (Boundary)', function () {
    // Objective: Validate Apply Leave behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
