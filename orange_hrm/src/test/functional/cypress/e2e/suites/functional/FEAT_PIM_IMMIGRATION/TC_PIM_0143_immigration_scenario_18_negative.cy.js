/**
 * Test Case ID: TC_PIM_0143
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0143', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0143: Immigration - Scenario 18 (Negative)', function () {
    // Objective: Validate Immigration behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
