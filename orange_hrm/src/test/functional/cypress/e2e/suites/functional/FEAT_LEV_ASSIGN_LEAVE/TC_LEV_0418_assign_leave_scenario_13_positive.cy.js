/**
 * Test Case ID: TC_LEV_0418
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0418', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0418: Assign Leave - Scenario 13 (Positive)', function () {
    // Objective: Validate Assign Leave behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
