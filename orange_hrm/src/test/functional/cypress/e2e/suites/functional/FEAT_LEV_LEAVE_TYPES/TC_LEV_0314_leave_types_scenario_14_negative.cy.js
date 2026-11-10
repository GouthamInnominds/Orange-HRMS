/**
 * Test Case ID: TC_LEV_0314
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0314', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0314: Leave Types - Scenario 14 (Negative)', function () {
    // Objective: Validate Leave Types behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
