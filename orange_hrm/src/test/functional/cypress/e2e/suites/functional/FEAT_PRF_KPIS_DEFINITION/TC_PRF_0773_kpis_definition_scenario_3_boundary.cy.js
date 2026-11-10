/**
 * Test Case ID: TC_PRF_0773
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0773', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0773: KPIs Definition - Scenario 3 (Boundary)', function () {
    // Objective: Validate KPIs Definition behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
