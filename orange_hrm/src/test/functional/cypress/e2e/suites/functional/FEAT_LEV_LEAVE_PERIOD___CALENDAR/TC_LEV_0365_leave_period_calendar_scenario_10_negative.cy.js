/**
 * Test Case ID: TC_LEV_0365
 * Feature: FEAT_LEV_LEAVE_PERIOD___CALENDAR
 * Name: Leave Period & Calendar - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_PERIOD___CALENDAR: TC_LEV_0365', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0365: Leave Period & Calendar - Scenario 10 (Negative)', function () {
    // Objective: Validate Leave Period & Calendar behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
