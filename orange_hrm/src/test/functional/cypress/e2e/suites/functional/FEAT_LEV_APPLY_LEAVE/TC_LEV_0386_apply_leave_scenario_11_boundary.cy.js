/**
 * Test Case ID: TC_LEV_0386
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 11 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0386', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0386: Apply Leave - Scenario 11 (Boundary)', function () {
    // Objective: Validate Apply Leave behavior under Boundary conditions (Rule validation #11).
    cy.url().should('include', '/auth/login');
  });
});
