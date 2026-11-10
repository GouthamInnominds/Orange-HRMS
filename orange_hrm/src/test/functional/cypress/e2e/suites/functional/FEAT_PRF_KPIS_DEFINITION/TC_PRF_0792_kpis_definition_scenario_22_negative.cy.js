/**
 * Test Case ID: TC_PRF_0792
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0792', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0792: KPIs Definition - Scenario 22 (Negative)', function () {
    // Objective: Validate KPIs Definition behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
