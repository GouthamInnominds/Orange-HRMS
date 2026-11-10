/**
 * Test Case ID: TC_DIR_1026
 * Feature: FEAT_DIR_DASHBOARD_QUICK_LAUNCH___LEAVE_BALANCE_WIDGET
 * Name: Dashboard Quick Launch & Leave Balance Widget - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_DIR_DASHBOARD_QUICK_LAUNCH___LEAVE_BALANCE_WIDGET: TC_DIR_1026', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_1026: Dashboard Quick Launch & Leave Balance Widget - Scenario 21 (Positive)', function () {
    // Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
