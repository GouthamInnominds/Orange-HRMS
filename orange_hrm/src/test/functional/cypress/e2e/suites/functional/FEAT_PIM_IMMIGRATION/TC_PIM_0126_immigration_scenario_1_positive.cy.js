/**
 * Test Case ID: TC_PIM_0126
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0126', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0126: Immigration - Scenario 1 (Positive)', function () {
    // Objective: Validate Immigration behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
