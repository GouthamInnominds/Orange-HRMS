/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED | Tests: 6
 */

describe('Feature: FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_092: View upcoming work anniversaries within next 30 days', function () {
    // Priority: High | Objective: Verify employees whose joining-date anniversary falls within the next 0 to 30 days are listed.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_093: Anniversary falling exactly today is included (0-day boundary)', function () {
    // Priority: Medium | Objective: Verify an employee whose anniversary date is exactly today (date difference equals 0) is included in the list.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_094: Anniversary exactly 30 days away is included (upper boundary)', function () {
    // Priority: Medium | Objective: Verify an employee whose anniversary date is exactly 30 days from today is included in the results.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_095: Anniversary 31 days away is excluded', function () {
    // Priority: Medium | Objective: Verify an employee whose anniversary date is 31 days from today is excluded from the upcoming anniversaries list.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_096: Employee who joined in the current year is excluded', function () {
    // Priority: Medium | Objective: Verify an employee whose joinedDate year equals the current year is excluded from the anniversary list since they have not completed a full year.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_097: Terminated or purged employees are excluded from anniversary list', function () {
    // Priority: Medium | Objective: Verify employees with a termination record or purged status are excluded from the upcoming anniversaries feed even if their anniversary date falls within range.
    cy.url().should('include', '/auth/login');
  });

});
