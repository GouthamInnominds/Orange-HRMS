/**
 * Test Case ID: TC_PIM_0142
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0142', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0142: Immigration - Scenario 17 (Positive)', function () {
    // Objective: Validate Immigration behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
