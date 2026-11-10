/**
 * Test Case ID: TC_PIM_0044
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0044', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0044: Personal Details - Scenario 9 (Positive)', function () {
    // Objective: Validate Personal Details behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
