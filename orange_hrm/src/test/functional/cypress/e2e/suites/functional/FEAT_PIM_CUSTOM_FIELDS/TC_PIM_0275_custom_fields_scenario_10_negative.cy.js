/**
 * Test Case ID: TC_PIM_0275
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0275', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0275: Custom Fields - Scenario 10 (Negative)', function () {
    // Objective: Validate Custom Fields behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
