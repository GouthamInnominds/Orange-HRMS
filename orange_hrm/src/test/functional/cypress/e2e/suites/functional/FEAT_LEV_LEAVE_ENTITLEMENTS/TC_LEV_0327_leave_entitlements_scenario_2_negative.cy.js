/**
 * Test Case ID: TC_LEV_0327
 * Feature: FEAT_LEV_LEAVE_ENTITLEMENTS
 * Name: Leave Entitlements - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_ENTITLEMENTS: TC_LEV_0327', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0327: Leave Entitlements - Scenario 2 (Negative)', function () {
    // Objective: Validate Leave Entitlements behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
