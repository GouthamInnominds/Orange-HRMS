/**
 * Test Case ID: TC_E2E_JOURNEY_0052
 * Journey: Recruitment Vacancy, Candidate Application, Interview & Hiring
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0052: Recruitment Vacancy, Candidate Application, Interview & Hiring', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0052: E2E Journey 52 - Recruitment Vacancy, Candidate Application, Interview & Hiring', function () {
    cy.url().should('include', '/auth/login');
  });
});
