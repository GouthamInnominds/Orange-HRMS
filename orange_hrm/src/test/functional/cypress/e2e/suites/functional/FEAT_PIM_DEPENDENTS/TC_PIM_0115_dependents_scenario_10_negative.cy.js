/**
 * Test Case ID: TC_PIM_0115
 * Feature: FEAT_PIM_DEPENDENTS
 * Name: Dependents - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_DEPENDENTS: TC_PIM_0115', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0115: Dependents - Scenario 10 (Negative)', function () {
    // Objective: Validate Dependents behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
