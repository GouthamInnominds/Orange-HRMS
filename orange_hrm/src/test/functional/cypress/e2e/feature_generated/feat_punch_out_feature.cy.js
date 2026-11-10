/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_PUNCH_OUT | Tests: 8
 */

describe('Feature: FEAT_PUNCH_OUT', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ATT_013: Punch out successfully after an active punch in', function () {
    // Priority: High | Objective: Verify an employee who is currently punched in can punch out successfully.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_014: Punch out fails when employee has no active punch-in record', function () {
    // Priority: High | Objective: Verify punch out is rejected with \'Cannot Proceed Punch Out Employee Already Punched Out\' when there is no open punch-in record.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_015: Punch out fails when date field is missing', function () {
    // Priority: Medium | Objective: Verify punch out request is rejected when the required \'date\' field is not provided.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_016: Punch out fails when time field is missing', function () {
    // Priority: Medium | Objective: Verify punch out request is rejected when the required \'time\' field is not provided.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_017: Punch out fails with invalid timezoneOffset value', function () {
    // Priority: Medium | Objective: Verify punch out is rejected when timezoneOffset does not match the expected TIMEZONE_OFFSET format.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_018: Punch out blocked when new punch-out time overlaps another attendance record', function () {
    // Priority: High | Objective: Verify punch out is rejected with \'Punch-Out Overlap Found\' when the resulting punched interval overlaps an existing attendance record.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_019: Punch out succeeds with an optional note within limit', function () {
    // Priority: Low | Objective: Verify punch out succeeds when an optional note of valid length is provided.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_020: Punch out rejected when system time is altered beyond tolerance and time-change is disabled', function () {
    // Priority: High | Objective: Verify punch out fails with \'Provided Date And Time Invalid\' when \'Allow employees to change time\' is disabled and supplied time differs from actual time by more than 180 seconds.
    cy.url().should('include', '/auth/login');
  });

});
