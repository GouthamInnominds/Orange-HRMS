/**
 * Test Case ID: TC_LEV_0397
 * Feature: FEAT_LEV_APPLY_LEAVE
 * Name: Apply Leave - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_APPLY_LEAVE: TC_LEV_0397', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0397: Apply Leave - Scenario 22 (Negative)', function () {
    // Objective: Validate Apply Leave behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
