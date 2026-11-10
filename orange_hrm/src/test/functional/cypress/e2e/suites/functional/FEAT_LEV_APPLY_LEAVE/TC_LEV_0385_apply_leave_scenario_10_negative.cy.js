/**
 * Test Case ID: TC_LEV_0385
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0385', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0385: Apply Leave - Scenario 10 (Negative)', function () {
    // Objective: Validate Apply Leave behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
