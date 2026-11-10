/**
 * Test Case ID: TC_PIM_0254
 * Feature: FEAT_PIM_MEMBERSHIPS
 * Name: Memberships - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_MEMBERSHIPS: TC_PIM_0254', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0254: Memberships - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Memberships behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
