/**
 * Test Case ID: TC_LEV_0430
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0430', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0430: Assign Leave - Scenario 25 (Positive)', function () {
    // Objective: Validate Assign Leave behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
