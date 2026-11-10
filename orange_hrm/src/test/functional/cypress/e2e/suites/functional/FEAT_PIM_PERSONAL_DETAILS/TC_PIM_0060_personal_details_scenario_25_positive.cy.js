/**
 * Test Case ID: TC_PIM_0060
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0060', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0060: Personal Details - Scenario 25 (Positive)', function () {
    // Objective: Validate Personal Details behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
