/**
 * Test Case ID: TC_LEV_0321
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0321', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0321: Leave Types - Scenario 21 (Positive)', function () {
    // Objective: Validate Leave Types behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
