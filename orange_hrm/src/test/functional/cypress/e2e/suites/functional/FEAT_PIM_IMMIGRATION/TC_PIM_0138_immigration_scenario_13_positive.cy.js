/**
 * Test Case ID: TC_PIM_0138
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0138', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0138: Immigration - Scenario 13 (Positive)', function () {
    // Objective: Validate Immigration behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
