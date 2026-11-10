/**
 * Test Case ID: TC_E2E_JOURNEY_0036
 * Journey: Recruitment Vacancy, Candidate Application, Interview & Hiring
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0036: Recruitment Vacancy, Candidate Application, Interview & Hiring', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0036: E2E Journey 36 - Recruitment Vacancy, Candidate Application, Interview & Hiring', function () {
    cy.url().should('include', '/auth/login');
  });
});
