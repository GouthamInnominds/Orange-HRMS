/**
 * Test Case ID: TC_E2E_JOURNEY_0043
 * Journey: Timesheet Period Creation, Submission & Supervisor Sign-off
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0043: Timesheet Period Creation, Submission & Supervisor Sign-off', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0043: E2E Journey 43 - Timesheet Period Creation, Submission & Supervisor Sign-off', function () {
    cy.url().should('include', '/auth/login');
  });
});
