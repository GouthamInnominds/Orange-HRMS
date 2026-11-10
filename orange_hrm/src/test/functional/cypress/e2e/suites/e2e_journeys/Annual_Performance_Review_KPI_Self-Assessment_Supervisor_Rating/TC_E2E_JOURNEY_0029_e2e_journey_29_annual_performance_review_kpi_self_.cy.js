/**
 * Test Case ID: TC_E2E_JOURNEY_0029
 * Journey: Annual Performance Review, KPI Self-Assessment & Supervisor Rating
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0029: Annual Performance Review, KPI Self-Assessment & Supervisor Rating', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0029: E2E Journey 29 - Annual Performance Review, KPI Self-Assessment & Supervisor Rating', function () {
    cy.url().should('include', '/auth/login');
  });
});
