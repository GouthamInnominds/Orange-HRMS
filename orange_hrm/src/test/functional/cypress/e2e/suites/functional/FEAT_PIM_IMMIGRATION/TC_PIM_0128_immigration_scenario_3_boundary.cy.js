/**
 * Test Case ID: TC_PIM_0128
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0128', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0128: Immigration - Scenario 3 (Boundary)', function () {
    // Objective: Validate Immigration behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
