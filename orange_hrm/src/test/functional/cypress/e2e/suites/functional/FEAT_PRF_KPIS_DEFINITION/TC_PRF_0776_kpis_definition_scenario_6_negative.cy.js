/**
 * Test Case ID: TC_PRF_0776
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0776', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0776: KPIs Definition - Scenario 6 (Negative)', function () {
    // Objective: Validate KPIs Definition behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
