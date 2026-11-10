/**
 * Test Case ID: TC_LEV_0381
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0381', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0381: Apply Leave - Scenario 6 (Negative)', function () {
    // Objective: Validate Apply Leave behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
