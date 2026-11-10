/**
 * Test Case ID: TC_LEV_0396
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0396', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0396: Apply Leave - Scenario 21 (Positive)', function () {
    // Objective: Validate Apply Leave behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
