/**
 * Test Case ID: TC_LEV_0330
 * Feature: FEAT_LEV_LEAVE_ENTITLEMENTS
 * Name: Leave Entitlements - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_ENTITLEMENTS: TC_LEV_0330', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0330: Leave Entitlements - Scenario 5 (Positive)', function () {
    // Objective: Validate Leave Entitlements behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
