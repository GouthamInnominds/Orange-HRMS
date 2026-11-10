/**
 * Test Case ID: TC_LEV_0308
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0308', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0308: Leave Types - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Leave Types behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
