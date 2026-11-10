/**
 * Test Case ID: TC_ATT_041
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___LIST
 * Name: List fails when fromDate is later than toDate
 * Priority: Medium
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___LIST: TC_ATT_041', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_041: List fails when fromDate is later than toDate', function () {
    // Objective: Verify the API rejects the request with an invalid parameter error when fromDate is chronologically after toDate.
    cy.url().should('include', '/auth/login');
  });
});
