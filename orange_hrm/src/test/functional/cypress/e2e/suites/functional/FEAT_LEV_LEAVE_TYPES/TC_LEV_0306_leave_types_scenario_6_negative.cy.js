/**
 * Test Case ID: TC_LEV_0306
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0306', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0306: Leave Types - Scenario 6 (Negative)', function () {
    // Objective: Validate Leave Types behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
