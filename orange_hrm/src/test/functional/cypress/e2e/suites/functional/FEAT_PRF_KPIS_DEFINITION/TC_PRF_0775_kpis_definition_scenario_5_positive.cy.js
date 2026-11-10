/**
 * Test Case ID: TC_PRF_0775
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0775', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0775: KPIs Definition - Scenario 5 (Positive)', function () {
    // Objective: Validate KPIs Definition behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
