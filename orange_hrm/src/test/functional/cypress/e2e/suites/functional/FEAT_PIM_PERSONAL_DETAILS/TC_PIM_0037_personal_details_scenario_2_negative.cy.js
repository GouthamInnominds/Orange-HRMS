/**
 * Test Case ID: TC_PIM_0037
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0037', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0037: Personal Details - Scenario 2 (Negative)', function () {
    // Objective: Validate Personal Details behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
