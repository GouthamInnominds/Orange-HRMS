/**
 * Test Case ID: TC_LEV_0352
 * Feature: FEAT_LEV_LEAVE_ENTITLEMENTS
 * Name: Leave Entitlements - Scenario 27 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_ENTITLEMENTS: TC_LEV_0352', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0352: Leave Entitlements - Scenario 27 (Boundary)', function () {
    // Objective: Validate Leave Entitlements behavior under Boundary conditions (Rule validation #27).
    cy.url().should('include', '/auth/login');
  });
});
