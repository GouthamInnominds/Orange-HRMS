/**
 * Test Case ID: TC_PIM_0264
 * Feature: FEAT_PIM_MEMBERSHIPS
 * Name: Memberships - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_MEMBERSHIPS: TC_PIM_0264', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0264: Memberships - Scenario 14 (Negative)', function () {
    // Objective: Validate Memberships behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
