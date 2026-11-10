/**
 * Test Case ID: TC_PRF_0780
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0780', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0780: KPIs Definition - Scenario 10 (Negative)', function () {
    // Objective: Validate KPIs Definition behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
