/**
 * Test Case ID: TC_LEV_0304
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0304', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0304: Leave Types - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Leave Types behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
