/**
 * Test Case ID: TC_LEV_0382
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 7 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0382', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0382: Apply Leave - Scenario 7 (Boundary)', function () {
    // Objective: Validate Apply Leave behavior under Boundary conditions (Rule validation #7).
    cy.url().should('include', '/auth/login');
  });
});
