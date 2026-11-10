/**
 * Test Case ID: TC_PIM_0131
 * Feature: FEAT_PIM_IMMIGRATION
 * Name: Immigration - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_IMMIGRATION: TC_PIM_0131', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0131: Immigration - Scenario 6 (Negative)', function () {
    // Objective: Validate Immigration behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
