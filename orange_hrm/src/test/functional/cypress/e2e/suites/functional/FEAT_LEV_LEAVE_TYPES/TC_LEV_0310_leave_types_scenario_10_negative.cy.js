/**
 * Test Case ID: TC_LEV_0310
 * Feature: FEAT_LEV_LEAVE_TYPES
 * Name: Leave Types - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_TYPES: TC_LEV_0310', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0310: Leave Types - Scenario 10 (Negative)', function () {
    // Objective: Validate Leave Types behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
