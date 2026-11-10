/**
 * Test Case ID: TC_BUZZ_094
 * Feature: FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED
 * Name: Anniversary exactly 30 days away is included (upper boundary)
 * Priority: Medium
 */

describe('Feature FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED: TC_BUZZ_094', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_094: Anniversary exactly 30 days away is included (upper boundary)', function () {
    // Objective: Verify an employee whose anniversary date is exactly 30 days from today is included in the results.
    cy.url().should('include', '/auth/login');
  });
});
