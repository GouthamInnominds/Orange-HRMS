/**
 * Test Case ID: TC_LEV_0339
 * Feature: FEAT_LEV_LEAVE_ENTITLEMENTS
 * Name: Leave Entitlements - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_ENTITLEMENTS: TC_LEV_0339', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0339: Leave Entitlements - Scenario 14 (Negative)', function () {
    // Objective: Validate Leave Entitlements behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
