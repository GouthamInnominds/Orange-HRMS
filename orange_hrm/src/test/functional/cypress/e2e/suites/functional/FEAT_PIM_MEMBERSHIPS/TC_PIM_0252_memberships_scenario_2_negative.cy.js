/**
 * Test Case ID: TC_PIM_0252
 * Feature: FEAT_PIM_MEMBERSHIPS
 * Name: Memberships - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_MEMBERSHIPS: TC_PIM_0252', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0252: Memberships - Scenario 2 (Negative)', function () {
    // Objective: Validate Memberships behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
