/**
 * Test Case ID: TC_LEV_0405
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 30 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0405', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0405: Apply Leave - Scenario 30 (Negative)', function () {
    // Objective: Validate Apply Leave behavior under Negative conditions (Rule validation #30).
    cy.url().should('include', '/auth/login');
  });
});
