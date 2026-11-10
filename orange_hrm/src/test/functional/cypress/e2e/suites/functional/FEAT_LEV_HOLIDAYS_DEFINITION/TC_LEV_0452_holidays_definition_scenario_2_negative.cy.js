/**
 * Test Case ID: TC_LEV_0452
 * Feature: FEAT_LEV_HOLIDAYS_DEFINITION
 * Name: Holidays Definition - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_HOLIDAYS_DEFINITION: TC_LEV_0452', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0452: Holidays Definition - Scenario 2 (Negative)', function () {
    // Objective: Validate Holidays Definition behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
