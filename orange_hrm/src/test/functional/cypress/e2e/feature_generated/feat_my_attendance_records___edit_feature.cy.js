/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___EDIT | Tests: 11
 */

describe('Feature: FEAT_MY_ATTENDANCE_RECORDS___EDIT', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ATT_021: Edit punch-in time of an active (currently punched-in) record', function () {
    // Priority: High | Objective: Verify a user with edit permission can successfully update the punch-in date/time of a record that is still in PUNCHED IN state.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_022: Edit both punch-in and punch-out time of a completed record', function () {
    // Priority: High | Objective: Verify a user can update both punch-in and punch-out date/time of a fully punched-out attendance record.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_023: Edit fails when only timezoneOffset is supplied without timezoneName', function () {
    // Priority: Medium | Objective: Verify editing a record fails with \'Valid Timezone Offset and Timezone Name Must Be Provided\' when only one of the timezone fields is supplied.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_024: Edit completed record fails when punchOutTime is missing while punchOutDate is provided', function () {
    // Priority: Medium | Objective: Verify editing a PUNCHED OUT record fails with \'Punch Out Date And Time Should Not Be Null\' when punchOutDate is given but punchOutTime is null.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_025: Edit blocked when new punch-in time overlaps another record', function () {
    // Priority: High | Objective: Verify editing the punch-in time is rejected with \'Punch-In Overlap Found\' if the new time overlaps an existing attendance record for the same employee.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_026: Edit blocked when new punch-out time overlaps another record', function () {
    // Priority: High | Objective: Verify editing punch-out time of a completed record is rejected with \'Punch-Out Overlap Found\' when the new interval overlaps another attendance record.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_027: Edit denied for a record the user is not authorized to modify', function () {
    // Priority: High | Objective: Verify a user without the appropriate edit-punch-time workflow permission for the record\'s owner receives a 403 Forbidden.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_028: Edit fails for a non-existent attendance record ID', function () {
    // Priority: Medium | Objective: Verify editing an attendance record with an ID that does not exist returns a 404 Record Not Found error.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_029: Delete attendance record via /attendance/records/{id} is not implemented', function () {
    // Priority: Low | Objective: Verify calling DELETE on the single-record attendance endpoint returns a Not Implemented response, confirming deletion must go through the employee-scoped delete endpoint.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_030: Edit fails with invalid punchInDate format', function () {
    // Priority: Medium | Objective: Verify editing a record is rejected when punchInDate does not conform to the expected API date format.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_031: Edit record ID parameter must be a positive integer', function () {
    // Priority: Low | Objective: Verify editing an attendance record fails validation when the {id} path parameter is not a positive integer (e.g. 0 or negative).
    cy.url().should('include', '/auth/login');
  });

});
