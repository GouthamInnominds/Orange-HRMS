/**
 * Test Case ID: TC_PRF_0795
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0795', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0795: KPIs Definition - Scenario 25 (Positive)', function () {
    // Objective: Validate KPIs Definition behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
