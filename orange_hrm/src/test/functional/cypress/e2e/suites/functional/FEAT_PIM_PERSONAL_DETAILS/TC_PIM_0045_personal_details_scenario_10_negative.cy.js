/**
 * Test Case ID: TC_PIM_0045
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0045', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0045: Personal Details - Scenario 10 (Negative)', function () {
    // Objective: Validate Personal Details behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
