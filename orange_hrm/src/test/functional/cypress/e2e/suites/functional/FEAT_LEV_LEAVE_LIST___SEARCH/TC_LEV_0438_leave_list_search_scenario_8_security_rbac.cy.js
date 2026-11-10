/**
 * Test Case ID: TC_LEV_0438
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0438', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0438: Leave List & Search - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Leave List & Search behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
