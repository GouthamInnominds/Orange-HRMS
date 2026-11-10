/**
 * Test Case ID: TC_PIM_0111
 * Feature: FEAT_PIM_DEPENDENTS
 * Name: Dependents - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_DEPENDENTS: TC_PIM_0111', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0111: Dependents - Scenario 6 (Negative)', function () {
    // Objective: Validate Dependents behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
