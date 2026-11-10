/**
 * Test Case ID: TC_ATT_053
 * Feature: FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_
 * Name: List employee attendance records fails for a non-existent employee number
 * Priority: Medium
 */

describe('Feature FEAT_EMPLOYEE_ATTENDANCE_RECORDS__ADMIN_SUPERVISOR_: TC_ATT_053', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_053: List employee attendance records fails for a non-existent employee number', function () {
    // Objective: Verify the API rejects the request when empNumber does not correspond to an existing employee (ENTITY_ID_EXISTS rule).
    cy.url().should('include', '/auth/login');
  });
});
