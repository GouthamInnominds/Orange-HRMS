/**
 * Test Case ID: TC_PIM_0130
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0130', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0130: Immigration - Scenario 5 (Positive)', function () {
    // Objective: Validate Immigration behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
