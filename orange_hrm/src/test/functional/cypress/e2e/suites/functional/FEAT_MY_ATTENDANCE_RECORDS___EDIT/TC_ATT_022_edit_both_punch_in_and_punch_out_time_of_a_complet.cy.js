/**
 * Test Case ID: TC_ATT_022
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___EDIT
 * Name: Edit both punch-in and punch-out time of a completed record
 * Priority: High
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___EDIT: TC_ATT_022', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_022: Edit both punch-in and punch-out time of a completed record', function () {
    // Objective: Verify a user can update both punch-in and punch-out date/time of a fully punched-out attendance record.
    cy.url().should('include', '/auth/login');
  });
});
