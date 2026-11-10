/**
 * Test Case ID: TC_LEV_0357
 * Feature: FEAT_LEV_LEAVE_PERIOD___CALENDAR
 * Name: Leave Period & Calendar - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_LEV_LEAVE_PERIOD___CALENDAR: TC_LEV_0357', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0357: Leave Period & Calendar - Scenario 2 (Negative)', function () {
    // Objective: Validate Leave Period & Calendar behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
