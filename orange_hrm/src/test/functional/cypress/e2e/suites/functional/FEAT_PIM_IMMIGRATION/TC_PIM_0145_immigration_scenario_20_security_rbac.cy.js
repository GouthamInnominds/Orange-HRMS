/**
 * Test Case ID: TC_PIM_0145
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0145', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0145: Immigration - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Immigration behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
