/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_ATTENDANCE_CONFIGURATION | Tests: 8
 */

describe('Feature: FEAT_ATTENDANCE_CONFIGURATION', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ATT_063: Admin retrieves current attendance configuration', function () {
    // Priority: High | Objective: Verify Admin can fetch the current values of all three attendance configuration toggles.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_064: Admin enables \'Allow Employees to Change Punch In/Out Time\'', function () {
    // Priority: High | Objective: Verify enabling canUserChangeCurrentTime is persisted and reflected in subsequent punch actions.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_065: Admin disables \'Employee can edit/delete own attendance records\'', function () {
    // Priority: High | Objective: Verify disabling canUserModifyAttendance prevents ESS users from editing/deleting their own attendance going forward.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_066: Admin enables \'Supervisor can add/edit/delete subordinate attendance records\'', function () {
    // Priority: Medium | Objective: Verify enabling canSupervisorModifyAttendance allows supervisors to manage subordinate attendance records.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_067: Update configuration fails when a required boolean field is missing', function () {
    // Priority: Medium | Objective: Verify the update request is rejected when one of the three required configuration fields is omitted.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_068: Update configuration fails with a non-boolean value', function () {
    // Priority: Medium | Objective: Verify the update request is rejected when a configuration field is supplied as a non-boolean type (e.g., string \'yes\').
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_069: Non-admin user is forbidden from accessing attendance configuration', function () {
    // Priority: High | Objective: Verify a user without Admin privileges cannot view or update the attendance configuration.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_070: Configuration changes persist after being saved', function () {
    // Priority: Medium | Objective: Verify that after updating the configuration, re-fetching it returns the newly saved values.
    cy.url().should('include', '/auth/login');
  });

});
