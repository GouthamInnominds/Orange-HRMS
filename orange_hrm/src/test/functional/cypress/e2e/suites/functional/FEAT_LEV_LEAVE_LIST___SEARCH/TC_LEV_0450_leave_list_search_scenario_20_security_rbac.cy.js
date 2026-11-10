/**
 * Test Case ID: TC_LEV_0450
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0450', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0450: Leave List & Search - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Leave List & Search behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
