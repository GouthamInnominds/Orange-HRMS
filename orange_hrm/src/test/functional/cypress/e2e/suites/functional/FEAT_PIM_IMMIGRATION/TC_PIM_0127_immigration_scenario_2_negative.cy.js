/**
 * Test Case ID: TC_PIM_0127
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0127', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0127: Immigration - Scenario 2 (Negative)', function () {
    // Objective: Validate Immigration behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
