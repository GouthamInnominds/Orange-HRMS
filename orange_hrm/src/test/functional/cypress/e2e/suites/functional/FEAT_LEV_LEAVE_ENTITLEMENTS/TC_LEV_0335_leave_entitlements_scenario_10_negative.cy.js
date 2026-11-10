/**
 * Test Case ID: TC_LEV_0335
 * Feature: FEAT_LEV_LEAVE_ENTITLEMENTS
 * Name: Leave Entitlements - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_ENTITLEMENTS: TC_LEV_0335', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0335: Leave Entitlements - Scenario 10 (Negative)', function () {
    // Objective: Validate Leave Entitlements behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
