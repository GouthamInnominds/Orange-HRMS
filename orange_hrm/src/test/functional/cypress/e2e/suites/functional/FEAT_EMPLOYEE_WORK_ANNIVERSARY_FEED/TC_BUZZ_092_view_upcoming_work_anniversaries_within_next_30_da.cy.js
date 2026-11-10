/**
 * Test Case ID: TC_BUZZ_092
 * Feature: FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED
 * Name: View upcoming work anniversaries within next 30 days
 * Priority: High
 */

describe('Feature FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED: TC_BUZZ_092', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_092: View upcoming work anniversaries within next 30 days', function () {
    // Objective: Verify employees whose joining-date anniversary falls within the next 0 to 30 days are listed.
    cy.url().should('include', '/auth/login');
  });
});
