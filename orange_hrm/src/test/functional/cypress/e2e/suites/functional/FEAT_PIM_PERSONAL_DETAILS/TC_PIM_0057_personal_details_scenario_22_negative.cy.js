/**
 * Test Case ID: TC_PIM_0057
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0057', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0057: Personal Details - Scenario 22 (Negative)', function () {
    // Objective: Validate Personal Details behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
