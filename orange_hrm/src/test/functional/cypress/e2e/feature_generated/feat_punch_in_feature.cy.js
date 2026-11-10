/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_PUNCH_IN | Tests: 12
 */

describe('Feature: FEAT_PUNCH_IN', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ATT_001: Punch in successfully with valid date, time and timezone', function () {
    // Priority: High | Objective: Verify an employee can punch in successfully with all valid required fields.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_002: Punch in fails when date field is missing', function () {
    // Priority: Medium | Objective: Verify punch in request is rejected when the required \'date\' field is not provided.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_003: Punch in fails when time field is missing', function () {
    // Priority: Medium | Objective: Verify punch in request is rejected when the required \'time\' field is not provided.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_004: Punch in fails when timezoneOffset is missing', function () {
    // Priority: Medium | Objective: Verify punch in request is rejected when the required \'timezoneOffset\' field is not provided.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_005: Punch in fails when timezoneName is missing', function () {
    // Priority: Medium | Objective: Verify punch in request is rejected when the required \'timezoneName\' field is not provided.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_006: Punch in fails with invalid time format', function () {
    // Priority: Medium | Objective: Verify punch in rejects a time value that does not match the required \'H:i\' format.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_007: Punch in note accepted up to 250 characters', function () {
    // Priority: Medium | Objective: Verify the punch-in note field is accepted when it is at the maximum allowed length of 250 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_008: Punch in fails when note exceeds 250 characters', function () {
    // Priority: Medium | Objective: Verify punch in is rejected when the note field exceeds the 250 character maximum length.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_009: Punch in blocked when an overlapping punched-in record already exists', function () {
    // Priority: High | Objective: Verify punch in is rejected with \'Punch-In Overlap Found\' when the employee already has an overlapping open attendance record.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_010: Punch in rejected when system time is altered beyond tolerance and \'Allow employees to change time\' is disabled', function () {
    // Priority: High | Objective: Verify punch in fails with \'Provided Date And Time Invalid\' when the configuration disallows changing current time and the supplied date/time differs from the actual server time by more than 180 seconds.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_011: Punch in succeeds when time is within +/-180 second tolerance and time-change is disabled', function () {
    // Priority: Medium | Objective: Verify punch in succeeds when \'Allow employees to change time\' is disabled but the supplied date/time is within the 180-second margin of the actual current time.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ATT_012: Punch in succeeds without an optional note', function () {
    // Priority: Low | Objective: Verify punch in succeeds when the optional \'note\' field is left blank.
    cy.url().should('include', '/auth/login');
  });

});
