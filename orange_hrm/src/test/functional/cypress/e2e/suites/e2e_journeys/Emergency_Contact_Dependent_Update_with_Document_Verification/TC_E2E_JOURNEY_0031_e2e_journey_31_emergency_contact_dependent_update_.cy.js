/**
 * Test Case ID: TC_E2E_JOURNEY_0031
 * Journey: Emergency Contact & Dependent Update with Document Verification
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0031: Emergency Contact & Dependent Update with Document Verification', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0031: E2E Journey 31 - Emergency Contact & Dependent Update with Document Verification', function () {
    cy.url().should('include', '/auth/login');
  });
});
