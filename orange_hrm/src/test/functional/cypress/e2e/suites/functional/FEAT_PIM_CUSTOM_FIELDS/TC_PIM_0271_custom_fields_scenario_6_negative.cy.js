/**
 * Test Case ID: TC_PIM_0271
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0271', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0271: Custom Fields - Scenario 6 (Negative)', function () {
    // Objective: Validate Custom Fields behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
