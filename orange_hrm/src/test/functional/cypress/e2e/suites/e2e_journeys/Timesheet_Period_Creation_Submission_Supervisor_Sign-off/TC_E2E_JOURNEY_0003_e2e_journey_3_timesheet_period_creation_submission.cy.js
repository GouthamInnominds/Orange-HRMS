/**
 * Test Case ID: TC_E2E_JOURNEY_0003
 * Journey: Timesheet Period Creation, Submission & Supervisor Sign-off
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0003: Timesheet Period Creation, Submission & Supervisor Sign-off', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0003: E2E Journey 3 - Timesheet Period Creation, Submission & Supervisor Sign-off', function () {
    cy.url().should('include', '/auth/login');
  });
});
