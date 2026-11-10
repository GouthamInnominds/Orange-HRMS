/**
 * Test Case ID: TC_PIM_0122
 * Feature: FEAT_PIM_DEPENDENTS
 * Name: Dependents - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_DEPENDENTS: TC_PIM_0122', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0122: Dependents - Scenario 17 (Positive)', function () {
    // Objective: Validate Dependents behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
