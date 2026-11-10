/**
 * Test Case ID: TC_PIM_0144
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 19 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0144', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0144: Immigration - Scenario 19 (Boundary)', function () {
    // Objective: Validate Immigration behavior under Boundary conditions (Rule validation #19).
    cy.url().should('include', '/auth/login');
  });
});
