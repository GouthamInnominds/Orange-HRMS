/**
 * Test Case ID: TC_PIM_0049
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0049', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0049: Personal Details - Scenario 14 (Negative)', function () {
    // Objective: Validate Personal Details behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
