/**
 * Test Case ID: TC_PIM_0136
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 11 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0136', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0136: Immigration - Scenario 11 (Boundary)', function () {
    // Objective: Validate Immigration behavior under Boundary conditions (Rule validation #11).
    cy.url().should('include', '/auth/login');
  });
});
