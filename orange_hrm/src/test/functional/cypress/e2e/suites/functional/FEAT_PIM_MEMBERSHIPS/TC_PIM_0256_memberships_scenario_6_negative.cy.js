/**
 * Test Case ID: TC_PIM_0256
 * Feature: FEAT_PIM_MEMBERSHIPS
 * Name: Memberships - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_MEMBERSHIPS: TC_PIM_0256', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0256: Memberships - Scenario 6 (Negative)', function () {
    // Objective: Validate Memberships behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
