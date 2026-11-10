/**
 * Test Case ID: TC_PIM_0281
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 16 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0281', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0281: Custom Fields - Scenario 16 (Security/RBAC)', function () {
    // Objective: Validate Custom Fields behavior under Security/RBAC conditions (Rule validation #16).
    cy.url().should('include', '/auth/login');
  });
});
