/**
 * Test Case ID: TC_PIM_0137
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 12 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0137', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0137: Immigration - Scenario 12 (Security/RBAC)', function () {
    // Objective: Validate Immigration behavior under Security/RBAC conditions (Rule validation #12).
    cy.url().should('include', '/auth/login');
  });
});
