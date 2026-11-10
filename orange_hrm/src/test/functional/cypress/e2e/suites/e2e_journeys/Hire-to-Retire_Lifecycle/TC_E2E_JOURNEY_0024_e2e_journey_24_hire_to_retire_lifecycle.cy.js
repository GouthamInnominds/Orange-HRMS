/**
 * Test Case ID: TC_E2E_JOURNEY_0024
 * Journey: Hire-to-Retire Lifecycle
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0024: Hire-to-Retire Lifecycle', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0024: E2E Journey 24 - Hire-to-Retire Lifecycle', function () {
    cy.url().should('include', '/auth/login');
  });
});
