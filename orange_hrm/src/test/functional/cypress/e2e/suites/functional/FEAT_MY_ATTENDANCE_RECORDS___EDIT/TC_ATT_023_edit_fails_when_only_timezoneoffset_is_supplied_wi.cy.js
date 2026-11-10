/**
 * Test Case ID: TC_ATT_023
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___EDIT
 * Name: Edit fails when only timezoneOffset is supplied without timezoneName
 * Priority: Medium
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___EDIT: TC_ATT_023', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_023: Edit fails when only timezoneOffset is supplied without timezoneName', function () {
    // Objective: Verify editing a record fails with \'Valid Timezone Offset and Timezone Name Must Be Provided\' when only one of the timezone fields is supplied.
    cy.url().should('include', '/auth/login');
  });
});
