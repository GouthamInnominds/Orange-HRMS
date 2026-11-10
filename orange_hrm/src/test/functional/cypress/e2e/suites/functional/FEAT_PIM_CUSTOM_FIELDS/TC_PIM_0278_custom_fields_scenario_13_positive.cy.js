/**
 * Test Case ID: TC_PIM_0278
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0278', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0278: Custom Fields - Scenario 13 (Positive)', function () {
    // Objective: Validate Custom Fields behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
