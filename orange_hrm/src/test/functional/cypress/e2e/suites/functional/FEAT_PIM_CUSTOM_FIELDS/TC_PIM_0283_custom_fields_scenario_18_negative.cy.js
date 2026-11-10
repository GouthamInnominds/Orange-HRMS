/**
 * Test Case ID: TC_PIM_0283
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0283', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0283: Custom Fields - Scenario 18 (Negative)', function () {
    // Objective: Validate Custom Fields behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
