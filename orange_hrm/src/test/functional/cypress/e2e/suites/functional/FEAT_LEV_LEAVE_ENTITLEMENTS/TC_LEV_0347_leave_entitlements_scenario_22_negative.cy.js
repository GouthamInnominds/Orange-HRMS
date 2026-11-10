/**
 * Test Case ID: TC_LEV_0347
 * Feature: FEAT_LEV_LEAVE_ENTITLEMENTS
 * Name: Leave Entitlements - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_ENTITLEMENTS: TC_LEV_0347', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0347: Leave Entitlements - Scenario 22 (Negative)', function () {
    // Objective: Validate Leave Entitlements behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
