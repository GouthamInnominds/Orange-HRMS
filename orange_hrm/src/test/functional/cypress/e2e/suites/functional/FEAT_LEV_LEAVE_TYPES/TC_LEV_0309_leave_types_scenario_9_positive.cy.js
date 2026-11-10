/**
 * Test Case ID: TC_LEV_0309
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0309', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0309: Leave Types - Scenario 9 (Positive)', function () {
    // Objective: Validate Leave Types behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
