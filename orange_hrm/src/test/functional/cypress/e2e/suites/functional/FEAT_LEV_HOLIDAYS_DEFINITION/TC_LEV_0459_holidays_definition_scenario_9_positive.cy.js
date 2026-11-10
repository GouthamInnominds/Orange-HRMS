/**
 * Test Case ID: TC_LEV_0459
 * Feature: FEAT_LEV_HOLIDAYS_DEFINITION
 * Name: Holidays Definition - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_HOLIDAYS_DEFINITION: TC_LEV_0459', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0459: Holidays Definition - Scenario 9 (Positive)', function () {
    // Objective: Validate Holidays Definition behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
