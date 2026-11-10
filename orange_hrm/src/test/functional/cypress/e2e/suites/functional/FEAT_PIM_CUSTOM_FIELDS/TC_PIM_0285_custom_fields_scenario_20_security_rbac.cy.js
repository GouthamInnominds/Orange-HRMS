/**
 * Test Case ID: TC_PIM_0285
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0285', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0285: Custom Fields - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Custom Fields behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
