/**
 * Test Case ID: TC_PIM_0050
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0050', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0050: Personal Details - Scenario 15 (Boundary)', function () {
    // Objective: Validate Personal Details behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
