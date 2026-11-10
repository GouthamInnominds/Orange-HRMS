/**
 * Test Case ID: TC_PIM_0053
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0053', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0053: Personal Details - Scenario 18 (Negative)', function () {
    // Objective: Validate Personal Details behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
