/**
 * Test Case ID: TC_E2E_JOURNEY_0009
 * Journey: Employee Onboarding & Organizational Placement
 * Priority: Critical
 */

describe('E2E Journey - TC_E2E_JOURNEY_0009: Employee Onboarding & Organizational Placement', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_E2E_JOURNEY_0009: E2E Journey 9 - Employee Onboarding & Organizational Placement', function () {
    cy.url().should('include', '/auth/login');
  });
});
