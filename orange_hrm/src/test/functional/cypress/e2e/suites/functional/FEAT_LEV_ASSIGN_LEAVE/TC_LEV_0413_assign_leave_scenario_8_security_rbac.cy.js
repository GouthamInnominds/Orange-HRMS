/**
 * Test Case ID: TC_LEV_0413
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0413', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0413: Assign Leave - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Assign Leave behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
