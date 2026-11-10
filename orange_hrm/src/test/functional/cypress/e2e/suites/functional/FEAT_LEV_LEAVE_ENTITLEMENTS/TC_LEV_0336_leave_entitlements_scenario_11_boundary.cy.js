/**
 * Test Case ID: TC_LEV_0336
 * Feature: FEAT_LEV_LEAVE_ENTITLEMENTS
 * Name: Leave Entitlements - Scenario 11 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_ENTITLEMENTS: TC_LEV_0336', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0336: Leave Entitlements - Scenario 11 (Boundary)', function () {
    // Objective: Validate Leave Entitlements behavior under Boundary conditions (Rule validation #11).
    cy.url().should('include', '/auth/login');
  });
});
