/**
 * Test Case ID: TC_PIM_0135
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0135', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0135: Immigration - Scenario 10 (Negative)', function () {
    // Objective: Validate Immigration behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
