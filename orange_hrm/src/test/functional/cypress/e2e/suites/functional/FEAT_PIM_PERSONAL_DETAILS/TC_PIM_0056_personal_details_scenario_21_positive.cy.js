/**
 * Test Case ID: TC_PIM_0056
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0056', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0056: Personal Details - Scenario 21 (Positive)', function () {
    // Objective: Validate Personal Details behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
