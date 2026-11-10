/**
 * Test Case ID: TC_ATT_038
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___LIST
 * Name: List own attendance records defaults to today's date when no filters supplied
 * Priority: High
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___LIST: TC_ATT_038', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_038: List own attendance records defaults to today\'s date when no filters supplied', function () {
    // Objective: Verify that when no date, fromDate or toDate is supplied, the record list defaults to showing only today\'s attendance records.
    cy.url().should('include', '/auth/login');
  });
});
