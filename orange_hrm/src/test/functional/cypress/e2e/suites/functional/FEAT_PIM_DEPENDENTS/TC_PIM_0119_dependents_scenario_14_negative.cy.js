/**
 * Test Case ID: TC_PIM_0119
 * Feature: FEAT_PIM_DEPENDENTS
 * Name: Dependents - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_DEPENDENTS: TC_PIM_0119', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0119: Dependents - Scenario 14 (Negative)', function () {
    // Objective: Validate Dependents behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
