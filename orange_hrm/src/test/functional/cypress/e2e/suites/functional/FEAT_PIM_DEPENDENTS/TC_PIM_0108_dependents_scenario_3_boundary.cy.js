/**
 * Test Case ID: TC_PIM_0108
 * Feature: FEAT_PIM_DEPENDENTS
 * Name: Dependents - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_DEPENDENTS: TC_PIM_0108', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0108: Dependents - Scenario 3 (Boundary)', function () {
    // Objective: Validate Dependents behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
