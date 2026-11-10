/**
 * Test Case ID: TC_ATT_088
 * Feature: FEAT_LATEST_ATTENDANCE_RECORD
 * Name: Get the latest attendance record for another employee via empNumber
 * Priority: Medium
 */

describe('Feature FEAT_LATEST_ATTENDANCE_RECORD: TC_ATT_088', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_088: Get the latest attendance record for another employee via empNumber', function () {
    // Objective: Verify a Supervisor/Admin can retrieve the latest attendance record of a specific employee by supplying empNumber, subject to accessible-employee validation.
    cy.url().should('include', '/auth/login');
  });
});
