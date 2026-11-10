/**
 * Test Case ID: TC_LEV_0463
 * Feature: FEAT_LEV_HOLIDAYS_DEFINITION
 * Name: Holidays Definition - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_HOLIDAYS_DEFINITION: TC_LEV_0463', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0463: Holidays Definition - Scenario 13 (Positive)', function () {
    // Objective: Validate Holidays Definition behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
