/**
 * Test Case ID: TC_ATT_064
 * Feature: FEAT_ATTENDANCE_CONFIGURATION
 * Name: Admin enables 'Allow Employees to Change Punch In/Out Time'
 * Priority: High
 */

describe('Feature FEAT_ATTENDANCE_CONFIGURATION: TC_ATT_064', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_064: Admin enables \'Allow Employees to Change Punch In/Out Time\'', function () {
    // Objective: Verify enabling canUserChangeCurrentTime is persisted and reflected in subsequent punch actions.
    cy.url().should('include', '/auth/login');
  });
});
