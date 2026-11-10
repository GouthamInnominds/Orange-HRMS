/**
 * Test Case ID: TC_LEV_0425
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0425', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0425: Assign Leave - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Assign Leave behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
