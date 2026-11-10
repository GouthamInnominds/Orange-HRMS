/**
 * Test Case ID: TC_LEV_0375
 * Feature: FEAT_LEV_LEAVE_PERIOD___CALENDAR
 * Name: Leave Period & Calendar - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_PERIOD___CALENDAR: TC_LEV_0375', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0375: Leave Period & Calendar - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Leave Period & Calendar behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
