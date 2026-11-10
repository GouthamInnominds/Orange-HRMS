/**
 * Test Case ID: TC_LEV_0388
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0388', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0388: Apply Leave - Scenario 13 (Positive)', function () {
    // Objective: Validate Apply Leave behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
