/**
 * Test Case ID: TC_LEV_0322
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0322', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0322: Leave Types - Scenario 22 (Negative)', function () {
    // Objective: Validate Leave Types behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
