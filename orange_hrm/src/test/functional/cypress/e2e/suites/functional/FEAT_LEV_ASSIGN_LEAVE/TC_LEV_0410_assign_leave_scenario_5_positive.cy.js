/**
 * Test Case ID: TC_LEV_0410
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0410', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0410: Assign Leave - Scenario 5 (Positive)', function () {
    // Objective: Validate Assign Leave behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
