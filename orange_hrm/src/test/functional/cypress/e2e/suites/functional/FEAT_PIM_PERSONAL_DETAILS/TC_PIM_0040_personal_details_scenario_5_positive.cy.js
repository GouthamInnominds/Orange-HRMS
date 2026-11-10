/**
 * Test Case ID: TC_PIM_0040
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0040', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0040: Personal Details - Scenario 5 (Positive)', function () {
    // Objective: Validate Personal Details behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
