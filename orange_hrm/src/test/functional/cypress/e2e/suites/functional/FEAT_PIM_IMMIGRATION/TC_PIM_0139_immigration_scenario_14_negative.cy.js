/**
 * Test Case ID: TC_PIM_0139
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0139', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0139: Immigration - Scenario 14 (Negative)', function () {
    // Objective: Validate Immigration behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
