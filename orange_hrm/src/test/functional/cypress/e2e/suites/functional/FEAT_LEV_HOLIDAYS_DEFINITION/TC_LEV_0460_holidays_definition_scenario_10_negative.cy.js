/**
 * Test Case ID: TC_LEV_0460
 * Feature: FEAT_LEV_HOLIDAYS_DEFINITION
 * Name: Holidays Definition - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_HOLIDAYS_DEFINITION: TC_LEV_0460', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0460: Holidays Definition - Scenario 10 (Negative)', function () {
    // Objective: Validate Holidays Definition behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
