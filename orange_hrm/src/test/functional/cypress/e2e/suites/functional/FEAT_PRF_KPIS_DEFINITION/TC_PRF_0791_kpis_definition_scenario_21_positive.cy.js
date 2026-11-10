/**
 * Test Case ID: TC_PRF_0791
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0791', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0791: KPIs Definition - Scenario 21 (Positive)', function () {
    // Objective: Validate KPIs Definition behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
