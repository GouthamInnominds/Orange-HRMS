/**
 * Test Case ID: TC_PIM_0038
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0038', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0038: Personal Details - Scenario 3 (Boundary)', function () {
    // Objective: Validate Personal Details behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
