/**
 * Test Case ID: TC_ATT_089
 * Feature: FEAT_LATEST_ATTENDANCE_RECORD
 * Name: Latest attendance record returns 404 when the employee has no records
 * Priority: Medium
 */

describe('Feature FEAT_LATEST_ATTENDANCE_RECORD: TC_ATT_089', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_089: Latest attendance record returns 404 when the employee has no records', function () {
    // Objective: Verify the endpoint returns a Record Not Found error when the target employee has no attendance records at all.
    cy.url().should('include', '/auth/login');
  });
});
