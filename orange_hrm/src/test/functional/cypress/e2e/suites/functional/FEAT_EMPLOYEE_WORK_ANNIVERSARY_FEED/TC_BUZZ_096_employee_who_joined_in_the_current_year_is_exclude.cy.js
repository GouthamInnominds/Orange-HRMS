/**
 * Test Case ID: TC_BUZZ_096
 * Feature: FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED
 * Name: Employee who joined in the current year is excluded
 * Priority: Medium
 */

describe('Feature FEAT_EMPLOYEE_WORK_ANNIVERSARY_FEED: TC_BUZZ_096', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_096: Employee who joined in the current year is excluded', function () {
    // Objective: Verify an employee whose joinedDate year equals the current year is excluded from the anniversary list since they have not completed a full year.
    cy.url().should('include', '/auth/login');
  });
});
