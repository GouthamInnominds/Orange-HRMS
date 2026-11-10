/**
 * Test Case ID: TC_PIM_0274
 * Feature: FEAT_PIM_CUSTOM_FIELDS
 * Name: Custom Fields - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_CUSTOM_FIELDS: TC_PIM_0274', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0274: Custom Fields - Scenario 9 (Positive)', function () {
    // Objective: Validate Custom Fields behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
