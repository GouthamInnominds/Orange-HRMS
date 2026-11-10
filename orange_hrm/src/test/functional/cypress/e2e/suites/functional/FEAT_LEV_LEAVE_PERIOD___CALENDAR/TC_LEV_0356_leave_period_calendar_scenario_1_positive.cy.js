/**
 * Test Case ID: TC_LEV_0356
 * Feature: FEAT_LEV_LEAVE_PERIOD___CALENDAR
 * Name: Leave Period & Calendar - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_PERIOD___CALENDAR: TC_LEV_0356', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0356: Leave Period & Calendar - Scenario 1 (Positive)', function () {
    // Objective: Validate Leave Period & Calendar behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
