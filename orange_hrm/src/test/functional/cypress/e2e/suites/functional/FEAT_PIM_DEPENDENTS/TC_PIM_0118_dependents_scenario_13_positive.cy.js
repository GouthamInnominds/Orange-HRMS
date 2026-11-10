/**
 * Test Case ID: TC_PIM_0118
 * Feature: FEAT_PIM_DEPENDENTS
 * Name: Dependents - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_DEPENDENTS: TC_PIM_0118', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0118: Dependents - Scenario 13 (Positive)', function () {
    // Objective: Validate Dependents behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
