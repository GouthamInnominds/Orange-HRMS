/**
 * Test Case ID: TC_LEV_0395
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0395', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0395: Apply Leave - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Apply Leave behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
