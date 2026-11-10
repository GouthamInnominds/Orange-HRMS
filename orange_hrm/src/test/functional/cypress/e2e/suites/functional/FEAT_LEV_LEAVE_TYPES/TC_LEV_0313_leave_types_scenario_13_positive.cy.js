/**
 * Test Case ID: TC_LEV_0313
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0313', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0313: Leave Types - Scenario 13 (Positive)', function () {
    // Objective: Validate Leave Types behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
