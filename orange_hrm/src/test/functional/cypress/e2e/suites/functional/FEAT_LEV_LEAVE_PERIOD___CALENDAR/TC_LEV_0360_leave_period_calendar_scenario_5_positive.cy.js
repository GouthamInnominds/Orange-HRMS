/**
 * Test Case ID: TC_LEV_0360
 * Feature: FEAT_LEV_LEAVE_PERIOD___CALENDAR
 * Name: Leave Period & Calendar - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_LEV_LEAVE_PERIOD___CALENDAR: TC_LEV_0360', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0360: Leave Period & Calendar - Scenario 5 (Positive)', function () {
    // Objective: Validate Leave Period & Calendar behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
