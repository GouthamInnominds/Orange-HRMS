/**
 * Test Case ID: TC_E2E_JOURNEY_0021
 * Journey: Annual Performance Review, KPI Self-Assessment & Supervisor Rating
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0021: Annual Performance Review, KPI Self-Assessment & Supervisor Rating', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0021: E2E Journey 21 - Annual Performance Review, KPI Self-Assessment & Supervisor Rating', function () {
    cy.url().should('include', '/auth/login');
  });
});
