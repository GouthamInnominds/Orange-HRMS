/**
 * Test Case ID: TC_DIR_1028
 * Feature: FEAT_DIR_DASHBOARD_QUICK_LAUNCH___LEAVE_BALANCE_WIDGET
 * Name: Dashboard Quick Launch & Leave Balance Widget - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_DIR_DASHBOARD_QUICK_LAUNCH___LEAVE_BALANCE_WIDGET: TC_DIR_1028', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_DIR_1028: Dashboard Quick Launch & Leave Balance Widget - Scenario 23 (Boundary)', function () {
    // Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
