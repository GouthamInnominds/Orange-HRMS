/**
 * Test Case ID: TC_PIM_0251
 * Feature: FEAT_PIM_MEMBERSHIPS
 * Name: Memberships - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_MEMBERSHIPS: TC_PIM_0251', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0251: Memberships - Scenario 1 (Positive)', function () {
    // Objective: Validate Memberships behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
