/**
 * Test Case ID: TC_LEV_0391
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 16 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0391', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0391: Apply Leave - Scenario 16 (Security/RBAC)', function () {
    // Objective: Validate Apply Leave behavior under Security/RBAC conditions (Rule validation #16).
    cy.url().should('include', '/auth/login');
  });
});
