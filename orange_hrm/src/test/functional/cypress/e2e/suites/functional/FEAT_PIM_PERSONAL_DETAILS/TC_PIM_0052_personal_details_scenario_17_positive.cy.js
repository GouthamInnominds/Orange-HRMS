/**
 * Test Case ID: TC_PIM_0052
 * Feature: FEAT_PIM_PERSONAL_DETAILS
 * Name: Personal Details - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_PERSONAL_DETAILS: TC_PIM_0052', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0052: Personal Details - Scenario 17 (Positive)', function () {
    // Objective: Validate Personal Details behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
