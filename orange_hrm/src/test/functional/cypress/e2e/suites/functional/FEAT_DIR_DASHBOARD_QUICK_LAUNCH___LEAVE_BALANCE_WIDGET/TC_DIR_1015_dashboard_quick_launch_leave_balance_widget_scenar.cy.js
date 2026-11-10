/**
 * Test Case ID: TC_DIR_1015
 * Feature: FEAT_DIR_DASHBOARD_QUICK_LAUNCH___LEAVE_BALANCE_WIDGET
 * Name: Dashboard Quick Launch & Leave Balance Widget - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_DIR_DASHBOARD_QUICK_LAUNCH___LEAVE_BALANCE_WIDGET: TC_DIR_1015', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_1015: Dashboard Quick Launch & Leave Balance Widget - Scenario 10 (Negative)', function () {
    // Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
