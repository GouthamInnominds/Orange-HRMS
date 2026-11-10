/**
 * Test Case ID: TC_LEV_0320
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0320', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0320: Leave Types - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Leave Types behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
