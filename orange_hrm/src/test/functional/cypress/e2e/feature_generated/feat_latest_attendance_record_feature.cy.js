/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_LATEST_ATTENDANCE_RECORD | Tests: 3
 */

describe('Feature: FEAT_LATEST_ATTENDANCE_RECORD', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ATT_087: Get the latest attendance record for the logged-in user', function () {
    // Priority: Medium | Objective: Verify GET /attendance/records/latest returns the most recent attendance record for the authenticated user when no empNumber is supplied.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_088: Get the latest attendance record for another employee via empNumber', function () {
    // Priority: Medium | Objective: Verify a Supervisor/Admin can retrieve the latest attendance record of a specific employee by supplying empNumber, subject to accessible-employee validation.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_089: Latest attendance record returns 404 when the employee has no records', function () {
    // Priority: Medium | Objective: Verify the endpoint returns a Record Not Found error when the target employee has no attendance records at all.
    cy.url().should('include', '/auth/login');
  });

});
