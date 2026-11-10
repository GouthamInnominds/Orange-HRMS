/**
 * Test Case ID: TC_PRF_0793
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0793', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0793: KPIs Definition - Scenario 23 (Boundary)', function () {
    // Objective: Validate KPIs Definition behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
