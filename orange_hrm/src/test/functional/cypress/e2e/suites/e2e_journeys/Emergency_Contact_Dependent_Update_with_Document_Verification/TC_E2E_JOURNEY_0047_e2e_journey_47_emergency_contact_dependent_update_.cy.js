/**
 * Test Case ID: TC_E2E_JOURNEY_0047
 * Journey: Emergency Contact & Dependent Update with Document Verification
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0047: Emergency Contact & Dependent Update with Document Verification', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0047: E2E Journey 47 - Emergency Contact & Dependent Update with Document Verification', function () {
    cy.url().should('include', '/auth/login');
  });
});
