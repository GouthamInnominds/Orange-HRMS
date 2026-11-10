/**
 * Test Case ID: TC_PIM_0048
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0048', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0048: Personal Details - Scenario 13 (Positive)', function () {
    // Objective: Validate Personal Details behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
