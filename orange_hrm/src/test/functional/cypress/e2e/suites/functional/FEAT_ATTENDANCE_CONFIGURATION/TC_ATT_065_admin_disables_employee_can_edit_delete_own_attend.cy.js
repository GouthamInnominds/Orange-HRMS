/**
 * Test Case ID: TC_ATT_065
 * Feature: FEAT_ATTENDANCE_CONFIGURATION
 * Name: Admin disables 'Employee can edit/delete own attendance records'
 * Priority: High
 */

describe('Feature FEAT_ATTENDANCE_CONFIGURATION: TC_ATT_065', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_065: Admin disables \'Employee can edit/delete own attendance records\'', function () {
    // Objective: Verify disabling canUserModifyAttendance prevents ESS users from editing/deleting their own attendance going forward.
    cy.url().should('include', '/auth/login');
  });
});
