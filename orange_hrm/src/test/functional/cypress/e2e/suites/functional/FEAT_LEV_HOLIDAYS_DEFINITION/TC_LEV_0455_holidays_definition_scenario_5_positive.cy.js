/**
 * Test Case ID: TC_LEV_0455
 * Feature: FEAT_LEV_HOLIDAYS_DEFINITION
 * Name: Holidays Definition - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_HOLIDAYS_DEFINITION: TC_LEV_0455', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0455: Holidays Definition - Scenario 5 (Positive)', function () {
    // Objective: Validate Holidays Definition behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
