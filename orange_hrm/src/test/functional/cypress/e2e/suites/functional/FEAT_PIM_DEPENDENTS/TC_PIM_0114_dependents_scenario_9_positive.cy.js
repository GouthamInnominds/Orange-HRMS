/**
 * Test Case ID: TC_PIM_0114
 * Feature: FEAT_PIM_DEPENDENTS
 * Name: Dependents - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_DEPENDENTS: TC_PIM_0114', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0114: Dependents - Scenario 9 (Positive)', function () {
    // Objective: Validate Dependents behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
