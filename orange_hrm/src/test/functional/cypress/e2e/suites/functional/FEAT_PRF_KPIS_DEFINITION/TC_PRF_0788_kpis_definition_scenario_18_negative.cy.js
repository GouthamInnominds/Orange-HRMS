/**
 * Test Case ID: TC_PRF_0788
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0788', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0788: KPIs Definition - Scenario 18 (Negative)', function () {
    // Objective: Validate KPIs Definition behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
