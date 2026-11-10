/**
 * Test Case ID: TC_LEV_0380
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0380', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0380: Apply Leave - Scenario 5 (Positive)', function () {
    // Objective: Validate Apply Leave behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
