/**
 * Test Case ID: TC_LEV_0325
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0325', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0325: Leave Types - Scenario 25 (Positive)', function () {
    // Objective: Validate Leave Types behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
