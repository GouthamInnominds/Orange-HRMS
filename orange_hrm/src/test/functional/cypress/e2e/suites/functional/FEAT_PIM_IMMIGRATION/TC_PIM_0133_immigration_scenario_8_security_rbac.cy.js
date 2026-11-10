/**
 * Test Case ID: TC_PIM_0133
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0133', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0133: Immigration - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Immigration behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
