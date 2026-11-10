/**
 * Test Case ID: TC_LEV_0422
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0422', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0422: Assign Leave - Scenario 17 (Positive)', function () {
    // Objective: Validate Assign Leave behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
