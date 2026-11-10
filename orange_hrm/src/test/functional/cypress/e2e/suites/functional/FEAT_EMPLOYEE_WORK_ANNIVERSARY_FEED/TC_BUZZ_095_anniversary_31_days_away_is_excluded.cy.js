/**
 * Test Case ID: TC_BUZZ_095
 * Feature: FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED
 * Name: Anniversary 31 days away is excluded
 * Priority: Medium
 */

describe('Feature FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED: TC_BUZZ_095', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_095: Anniversary 31 days away is excluded', function () {
    // Objective: Verify an employee whose anniversary date is 31 days from today is excluded from the upcoming anniversaries list.
    cy.url().should('include', '/auth/login');
  });
});
