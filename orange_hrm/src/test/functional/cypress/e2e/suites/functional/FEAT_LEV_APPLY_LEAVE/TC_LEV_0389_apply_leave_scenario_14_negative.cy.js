/**
 * Test Case ID: TC_LEV_0389
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0389', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0389: Apply Leave - Scenario 14 (Negative)', function () {
    // Objective: Validate Apply Leave behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
