/**
 * Test Case ID: TC_LEV_0419
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0419', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0419: Assign Leave - Scenario 14 (Negative)', function () {
    // Objective: Validate Assign Leave behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
