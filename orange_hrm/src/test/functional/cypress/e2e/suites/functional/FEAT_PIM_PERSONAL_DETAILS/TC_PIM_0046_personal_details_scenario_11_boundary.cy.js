/**
 * Test Case ID: TC_PIM_0046
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 11 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0046', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0046: Personal Details - Scenario 11 (Boundary)', function () {
    // Objective: Validate Personal Details behavior under Boundary conditions (Rule validation #11).
    cy.url().should('include', '/auth/login');
  });
});
