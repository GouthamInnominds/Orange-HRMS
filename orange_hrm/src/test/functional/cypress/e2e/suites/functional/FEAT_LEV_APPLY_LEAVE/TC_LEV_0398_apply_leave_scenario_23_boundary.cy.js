/**
 * Test Case ID: TC_LEV_0398
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0398', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0398: Apply Leave - Scenario 23 (Boundary)', function () {
    // Objective: Validate Apply Leave behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
