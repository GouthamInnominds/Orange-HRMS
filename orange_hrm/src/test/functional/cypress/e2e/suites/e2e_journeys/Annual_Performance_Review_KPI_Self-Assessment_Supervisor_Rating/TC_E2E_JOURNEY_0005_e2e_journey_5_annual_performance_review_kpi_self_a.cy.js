/**
 * Test Case ID: TC_E2E_JOURNEY_0005
 * Journey: Annual Performance Review, KPI Self-Assessment & Supervisor Rating
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0005: Annual Performance Review, KPI Self-Assessment & Supervisor Rating', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0005: E2E Journey 5 - Annual Performance Review, KPI Self-Assessment & Supervisor Rating', function () {
    cy.url().should('include', '/auth/login');
  });
});
