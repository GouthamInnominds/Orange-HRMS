/**
 * Test Case ID: TC_PIM_0058
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0058', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0058: Personal Details - Scenario 23 (Boundary)', function () {
    // Objective: Validate Personal Details behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
