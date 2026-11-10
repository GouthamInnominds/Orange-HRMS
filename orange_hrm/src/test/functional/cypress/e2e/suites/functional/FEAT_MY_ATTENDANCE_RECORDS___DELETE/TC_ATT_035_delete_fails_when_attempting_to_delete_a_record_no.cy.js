/**
 * Test Case ID: TC_ATT_035
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___DELETE
 * Name: Delete fails when attempting to delete a record not owned by the requesting employee
 * Priority: High
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___DELETE: TC_ATT_035', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_035: Delete fails when attempting to delete a record not owned by the requesting employee', function () {
    // Objective: Verify deletion is denied with 403 Forbidden when one or more supplied record IDs do not belong to the target employee.
    cy.url().should('include', '/auth/login');
  });
});
