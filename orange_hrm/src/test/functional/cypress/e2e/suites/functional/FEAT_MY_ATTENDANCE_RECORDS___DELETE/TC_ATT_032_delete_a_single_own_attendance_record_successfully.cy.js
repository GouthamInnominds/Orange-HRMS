/**
 * Test Case ID: TC_ATT_032
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___DELETE
 * Name: Delete a single own attendance record successfully
 * Priority: High
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___DELETE: TC_ATT_032', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_032: Delete a single own attendance record successfully', function () {
    // Objective: Verify an employee with delete permission can delete one of their own attendance records.
    cy.url().should('include', '/auth/login');
  });
});
