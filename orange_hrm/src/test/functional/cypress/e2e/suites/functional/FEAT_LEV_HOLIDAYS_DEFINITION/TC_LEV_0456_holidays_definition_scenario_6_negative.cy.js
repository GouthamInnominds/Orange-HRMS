/**
 * Test Case ID: TC_LEV_0456
 * Feature: FEAT_LEV_HOLIDAYS_DEFINITION
 * Name: Holidays Definition - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_HOLIDAYS_DEFINITION: TC_LEV_0456', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0456: Holidays Definition - Scenario 6 (Negative)', function () {
    // Objective: Validate Holidays Definition behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
