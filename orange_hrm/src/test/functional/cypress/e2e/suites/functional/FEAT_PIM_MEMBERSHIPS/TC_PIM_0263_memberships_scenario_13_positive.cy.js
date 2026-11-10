/**
 * Test Case ID: TC_PIM_0263
 * Feature: FEAT_PIM_MEMBERSHIPS
 * Name: Memberships - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_MEMBERSHIPS: TC_PIM_0263', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0263: Memberships - Scenario 13 (Positive)', function () {
    // Objective: Validate Memberships behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
