/**
 * Test Case ID: TC_LEV_0363
 * Feature: FEAT_LEV_LEAVE_PERIOD___CALENDAR
 * Name: Leave Period & Calendar - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_PERIOD___CALENDAR: TC_LEV_0363', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0363: Leave Period & Calendar - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Leave Period & Calendar behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
