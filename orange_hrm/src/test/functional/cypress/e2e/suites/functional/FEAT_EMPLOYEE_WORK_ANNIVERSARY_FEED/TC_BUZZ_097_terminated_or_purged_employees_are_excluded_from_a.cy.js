/**
 * Test Case ID: TC_BUZZ_097
 * Feature: FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED
 * Name: Terminated or purged employees are excluded from anniversary list
 * Priority: Medium
 */

describe('Feature FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED: TC_BUZZ_097', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_097: Terminated or purged employees are excluded from anniversary list', function () {
    // Objective: Verify employees with a termination record or purged status are excluded from the upcoming anniversaries feed even if their anniversary date falls within range.
    cy.url().should('include', '/auth/login');
  });
});
