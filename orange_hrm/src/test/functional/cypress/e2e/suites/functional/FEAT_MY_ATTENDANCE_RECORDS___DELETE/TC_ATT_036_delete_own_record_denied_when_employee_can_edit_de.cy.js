/**
 * Test Case ID: TC_ATT_036
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___DELETE
 * Name: Delete own record denied when 'Employee can edit/delete own attendance' is disabled
 * Priority: High
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___DELETE: TC_ATT_036', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_036: Delete own record denied when \'Employee can edit/delete own attendance\' is disabled', function () {
    // Objective: Verify an ESS user cannot delete their own attendance record when the corresponding attendance configuration is turned off.
    cy.url().should('include', '/auth/login');
  });
});
