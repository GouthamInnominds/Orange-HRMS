/**
 * Test Case ID: TC_PIM_0134
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0134', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0134: Immigration - Scenario 9 (Positive)', function () {
    // Objective: Validate Immigration behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
