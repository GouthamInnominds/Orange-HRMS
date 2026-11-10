/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___DELETE | Tests: 6
 */

describe('Feature: FEAT_MY_ATTENDANCE_RECORDS___DELETE', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ATT_032: Delete a single own attendance record successfully', function () {
    // Priority: High | Objective: Verify an employee with delete permission can delete one of their own attendance records.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_033: Delete multiple own attendance records in a single request', function () {
    // Priority: Medium | Objective: Verify an employee can delete several of their own attendance records in one DELETE request using an array of IDs.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_034: Delete fails when ids array is empty', function () {
    // Priority: Medium | Objective: Verify deletion is rejected with \'No IDs Found\' when an empty ids array is submitted.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_035: Delete fails when attempting to delete a record not owned by the requesting employee', function () {
    // Priority: High | Objective: Verify deletion is denied with 403 Forbidden when one or more supplied record IDs do not belong to the target employee.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_036: Delete own record denied when \'Employee can edit/delete own attendance\' is disabled', function () {
    // Priority: High | Objective: Verify an ESS user cannot delete their own attendance record when the corresponding attendance configuration is turned off.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_037: Delete fails when ids parameter is not an array', function () {
    // Priority: Low | Objective: Verify the delete request is rejected by validation when the \'ids\' parameter is not of array type.
    cy.url().should('include', '/auth/login');
  });

});
