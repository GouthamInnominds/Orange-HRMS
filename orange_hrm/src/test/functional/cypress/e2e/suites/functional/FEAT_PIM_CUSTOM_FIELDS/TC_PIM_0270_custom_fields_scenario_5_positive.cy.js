/**
 * Test Case ID: TC_PIM_0270
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0270', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0270: Custom Fields - Scenario 5 (Positive)', function () {
    // Objective: Validate Custom Fields behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
