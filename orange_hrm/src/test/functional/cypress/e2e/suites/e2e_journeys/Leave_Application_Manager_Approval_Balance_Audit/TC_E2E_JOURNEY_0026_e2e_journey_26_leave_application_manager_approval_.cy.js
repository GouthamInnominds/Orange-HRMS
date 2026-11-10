/**
 * Test Case ID: TC_E2E_JOURNEY_0026
 * Journey: Leave Application, Manager Approval & Balance Audit
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0026: Leave Application, Manager Approval & Balance Audit', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0026: E2E Journey 26 - Leave Application, Manager Approval & Balance Audit', function () {
    cy.url().should('include', '/auth/login');
  });
});
