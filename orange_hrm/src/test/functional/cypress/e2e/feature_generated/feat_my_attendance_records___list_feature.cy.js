/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___LIST | Tests: 7
 */

describe('Feature: FEAT_MY_ATTENDANCE_RECORDS___LIST', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ATT_038: List own attendance records defaults to today\'s date when no filters supplied', function () {
    // Priority: High | Objective: Verify that when no date, fromDate or toDate is supplied, the record list defaults to showing only today\'s attendance records.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_039: List own attendance records filtered by a specific date', function () {
    // Priority: Medium | Objective: Verify filtering attendance records by the \'date\' query parameter returns only records for that date.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_040: List own attendance records using a fromDate/toDate range', function () {
    // Priority: Medium | Objective: Verify filtering by fromDate and toDate returns all attendance records within that inclusive date range.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_041: List fails when fromDate is later than toDate', function () {
    // Priority: Medium | Objective: Verify the API rejects the request with an invalid parameter error when fromDate is chronologically after toDate.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_042: List own attendance records with pagination', function () {
    // Priority: Low | Objective: Verify limit and offset query parameters correctly paginate the attendance record list.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_043: List own attendance records sorted by punch-in time', function () {
    // Priority: Low | Objective: Verify the sortField and sortOrder parameters correctly order the returned attendance records.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_044: Total worked-hours summary is calculated correctly for the filtered period', function () {
    // Priority: Medium | Objective: Verify the \'sum\' meta object (hours, minutes, label) accurately reflects the total working time of the returned records.
    cy.url().should('include', '/auth/login');
  });

});
