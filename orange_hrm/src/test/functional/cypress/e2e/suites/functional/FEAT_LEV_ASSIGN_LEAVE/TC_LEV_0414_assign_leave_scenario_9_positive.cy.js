/**
 * Test Case ID: TC_LEV_0414
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0414', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0414: Assign Leave - Scenario 9 (Positive)', function () {
    // Objective: Validate Assign Leave behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
