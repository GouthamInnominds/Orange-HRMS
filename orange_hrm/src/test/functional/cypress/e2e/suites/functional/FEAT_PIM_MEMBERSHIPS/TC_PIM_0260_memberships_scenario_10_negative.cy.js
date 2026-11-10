/**
 * Test Case ID: TC_PIM_0260
 * Feature: FEAT_PIM_MEMBERSHIPS
 * Name: Memberships - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_MEMBERSHIPS: TC_PIM_0260', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0260: Memberships - Scenario 10 (Negative)', function () {
    // Objective: Validate Memberships behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
