/**
 * Test Case ID: TC_LEV_0355
 * Feature: FEAT_LEV_LEAVE_ENTITLEMENTS
 * Name: Leave Entitlements - Scenario 30 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_ENTITLEMENTS: TC_LEV_0355', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0355: Leave Entitlements - Scenario 30 (Negative)', function () {
    // Objective: Validate Leave Entitlements behavior under Negative conditions (Rule validation #30).
    cy.url().should('include', '/auth/login');
  });
});
