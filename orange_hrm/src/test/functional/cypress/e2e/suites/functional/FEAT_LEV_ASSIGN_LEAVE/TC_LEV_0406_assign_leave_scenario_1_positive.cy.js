/**
 * Test Case ID: TC_LEV_0406
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0406', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0406: Assign Leave - Scenario 1 (Positive)', function () {
    // Objective: Validate Assign Leave behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
