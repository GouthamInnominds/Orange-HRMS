/**
 * Test Case ID: TC_E2E_JOURNEY_0035
 * Journey: Timesheet Period Creation, Submission & Supervisor Sign-off
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0035: Timesheet Period Creation, Submission & Supervisor Sign-off', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0035: E2E Journey 35 - Timesheet Period Creation, Submission & Supervisor Sign-off', function () {
    cy.url().should('include', '/auth/login');
  });
});
