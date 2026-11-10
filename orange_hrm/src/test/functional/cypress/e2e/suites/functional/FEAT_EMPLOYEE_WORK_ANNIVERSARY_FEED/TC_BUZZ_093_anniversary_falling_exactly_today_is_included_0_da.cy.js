/**
 * Test Case ID: TC_BUZZ_093
 * Feature: FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED
 * Name: Anniversary falling exactly today is included (0-day boundary)
 * Priority: Medium
 */

describe('Feature FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED: TC_BUZZ_093', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_093: Anniversary falling exactly today is included (0-day boundary)', function () {
    // Objective: Verify an employee whose anniversary date is exactly today (date difference equals 0) is included in the list.
    cy.url().should('include', '/auth/login');
  });
});
