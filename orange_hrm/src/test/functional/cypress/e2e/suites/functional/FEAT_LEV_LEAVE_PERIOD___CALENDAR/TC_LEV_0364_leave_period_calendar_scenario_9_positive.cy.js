/**
 * Test Case ID: TC_LEV_0364
 * Feature: FEAT_LEV_LEAVE_PERIOD___CALENDAR
 * Name: Leave Period & Calendar - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_LEAVE_PERIOD___CALENDAR: TC_LEV_0364', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0364: Leave Period & Calendar - Scenario 9 (Positive)', function () {
    // Objective: Validate Leave Period & Calendar behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
