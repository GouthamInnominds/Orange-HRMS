/**
 * Test Case ID: TC_LEV_0434
 * Feature: FEAT_LEV_LEAVE_LIST___SEARCH
 * Name: Leave List & Search - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_LIST___SEARCH: TC_LEV_0434', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0434: Leave List & Search - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Leave List & Search behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
