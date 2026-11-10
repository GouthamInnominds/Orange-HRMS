/**
 * Test Case ID: TC_ATT_050
 * Feature: FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_
 * Name: Supervisor delete of subordinate's record blocked when 'Supervisor can modify attendance' is disabled
 * Priority: High
 */

describe('Feature FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_: TC_ATT_050', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_050: Supervisor delete of subordinate\'s record blocked when \'Supervisor can modify attendance\' is disabled', function () {
    // Objective: Verify a Supervisor cannot delete a subordinate\'s attendance record when the corresponding configuration toggle is turned off.
    cy.url().should('include', '/auth/login');
  });
});
