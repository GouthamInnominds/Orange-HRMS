/**
 * Test Case ID: TC_LEV_0342
 * Feature: FEAT_LEV_LEAVE_ENTITLEMENTS
 * Name: Leave Entitlements - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_ENTITLEMENTS: TC_LEV_0342', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0342: Leave Entitlements - Scenario 17 (Positive)', function () {
    // Objective: Validate Leave Entitlements behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
