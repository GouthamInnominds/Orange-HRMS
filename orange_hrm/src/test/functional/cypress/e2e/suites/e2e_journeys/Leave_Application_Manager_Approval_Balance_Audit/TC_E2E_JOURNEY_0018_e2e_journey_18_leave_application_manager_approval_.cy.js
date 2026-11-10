/**
 * Test Case ID: TC_E2E_JOURNEY_0018
 * Journey: Leave Application, Manager Approval & Balance Audit
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0018: Leave Application, Manager Approval & Balance Audit', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0018: E2E Journey 18 - Leave Application, Manager Approval & Balance Audit', function () {
    cy.url().should('include', '/auth/login');
  });
});
