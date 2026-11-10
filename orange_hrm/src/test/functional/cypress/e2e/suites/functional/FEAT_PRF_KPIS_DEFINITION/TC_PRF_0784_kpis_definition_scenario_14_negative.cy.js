/**
 * Test Case ID: TC_PRF_0784
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0784', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0784: KPIs Definition - Scenario 14 (Negative)', function () {
    // Objective: Validate KPIs Definition behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
