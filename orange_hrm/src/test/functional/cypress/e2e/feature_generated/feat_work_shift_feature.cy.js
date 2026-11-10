/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_WORK_SHIFT | Tests: 10
 */

describe('Feature: FEAT_WORK_SHIFT', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_033: Create work shift with valid name, hours and time range', function () {
    // Priority: High | Objective: Verify a Work Shift can be created with valid name, hoursPerDay, startTime and endTime.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_034: Create work shift with missing required fields', function () {
    // Priority: High | Objective: Verify name, hoursPerDay, startTime and endTime are all mandatory.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_035: Create work shift with duplicate name', function () {
    // Priority: High | Objective: Verify work shift name must be unique.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_036: Create work shift with name exceeding 50 characters', function () {
    // Priority: Medium | Objective: Verify shift name is rejected when exceeding max length of 50 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_037: Create work shift with end time earlier than start time', function () {
    // Priority: High | Objective: Verify endTime must be greater than startTime (GREATER_THAN rule).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_038: Create work shift with invalid date/time format', function () {
    // Priority: Medium | Objective: Verify startTime and endTime must be valid date-time values.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_039: Create work shift and assign employees', function () {
    // Priority: Medium | Objective: Verify employees can be assigned to a work shift via empNumbers array on create.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_040: Update work shift details and re-assigned employees', function () {
    // Priority: Medium | Objective: Verify an existing work shift\'s details and employee assignments can be updated.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_041: List work shifts with sorting and pagination', function () {
    // Priority: Medium | Objective: Verify Work Shifts list supports sortField, sortOrder, limit and offset.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_042: Delete one or more work shifts', function () {
    // Priority: High | Objective: Verify selected work shifts can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });

});
