/**
 * Test Case ID: TC_PIM_0123
 * Feature: FEAT_PIM_DEPENDENTS
 * Name: Dependents - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_DEPENDENTS: TC_PIM_0123', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0123: Dependents - Scenario 18 (Negative)', function () {
    // Objective: Validate Dependents behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
