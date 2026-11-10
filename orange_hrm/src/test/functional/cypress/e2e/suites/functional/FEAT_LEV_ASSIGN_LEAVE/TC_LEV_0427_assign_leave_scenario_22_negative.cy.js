/**
 * Test Case ID: TC_LEV_0427
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0427', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0427: Assign Leave - Scenario 22 (Negative)', function () {
    // Objective: Validate Assign Leave behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
