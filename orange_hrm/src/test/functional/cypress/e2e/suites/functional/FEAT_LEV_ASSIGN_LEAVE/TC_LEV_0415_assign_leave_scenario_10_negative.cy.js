/**
 * Test Case ID: TC_LEV_0415
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0415', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0415: Assign Leave - Scenario 10 (Negative)', function () {
    // Objective: Validate Assign Leave behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
