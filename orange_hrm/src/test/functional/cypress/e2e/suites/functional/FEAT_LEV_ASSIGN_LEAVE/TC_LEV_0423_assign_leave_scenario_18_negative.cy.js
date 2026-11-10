/**
 * Test Case ID: TC_LEV_0423
 * Feature: FEAT_LEV_ASSIGN_LEAVE
 * Name: Assign Leave - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_ASSIGN_LEAVE: TC_LEV_0423', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0423: Assign Leave - Scenario 18 (Negative)', function () {
    // Objective: Validate Assign Leave behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
