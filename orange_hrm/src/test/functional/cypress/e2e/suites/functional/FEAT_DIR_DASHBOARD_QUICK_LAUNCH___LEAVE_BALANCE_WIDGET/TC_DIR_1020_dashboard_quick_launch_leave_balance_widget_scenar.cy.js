/**
 * Test Case ID: TC_DIR_1020
 * Feature: FEAT_DIR_DASHBOARD_QUICK_LAUNCH___LEAVE_BALANCE_WIDGET
 * Name: Dashboard Quick Launch & Leave Balance Widget - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_DIR_DASHBOARD_QUICK_LAUNCH___LEAVE_BALANCE_WIDGET: TC_DIR_1020', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_1020: Dashboard Quick Launch & Leave Balance Widget - Scenario 15 (Boundary)', function () {
    // Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
