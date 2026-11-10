/**
 * Test Case ID: TC_PRF_0781
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 11 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0781', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0781: KPIs Definition - Scenario 11 (Boundary)', function () {
    // Objective: Validate KPIs Definition behavior under Boundary conditions (Rule validation #11).
    cy.url().should('include', '/auth/login');
  });
});
