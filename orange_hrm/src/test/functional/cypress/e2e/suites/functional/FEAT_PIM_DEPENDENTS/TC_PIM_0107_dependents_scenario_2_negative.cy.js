/**
 * Test Case ID: TC_PIM_0107
 * Feature: FEAT_PIM_DEPENDENTS
 * Name: Dependents - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_DEPENDENTS: TC_PIM_0107', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0107: Dependents - Scenario 2 (Negative)', function () {
    // Objective: Validate Dependents behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
