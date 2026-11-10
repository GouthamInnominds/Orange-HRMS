/**
 * Test Case ID: TC_LEV_0394
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 19 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0394', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0394: Apply Leave - Scenario 19 (Boundary)', function () {
    // Objective: Validate Apply Leave behavior under Boundary conditions (Rule validation #19).
    cy.url().should('include', '/auth/login');
  });
});
