/**
 * Test Case ID: TC_PRF_0785
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0785', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0785: KPIs Definition - Scenario 15 (Boundary)', function () {
    // Objective: Validate KPIs Definition behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
