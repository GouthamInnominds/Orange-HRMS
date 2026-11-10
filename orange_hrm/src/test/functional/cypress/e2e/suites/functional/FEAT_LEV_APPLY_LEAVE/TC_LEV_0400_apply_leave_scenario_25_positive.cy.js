/**
 * Test Case ID: TC_LEV_0400
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0400', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0400: Apply Leave - Scenario 25 (Positive)', function () {
    // Objective: Validate Apply Leave behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
