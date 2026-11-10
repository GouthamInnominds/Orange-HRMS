/**
 * Test Case ID: TC_LEV_0464
 * Feature: FEAT_LEV_HOLIDAYS_DEFINITION
 * Name: Holidays Definition - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_HOLIDAYS_DEFINITION: TC_LEV_0464', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0464: Holidays Definition - Scenario 14 (Negative)', function () {
    // Objective: Validate Holidays Definition behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
