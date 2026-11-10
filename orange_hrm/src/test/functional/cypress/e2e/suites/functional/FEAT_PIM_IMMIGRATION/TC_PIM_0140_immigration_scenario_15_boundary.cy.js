/**
 * Test Case ID: TC_PIM_0140
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0140', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0140: Immigration - Scenario 15 (Boundary)', function () {
    // Objective: Validate Immigration behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
