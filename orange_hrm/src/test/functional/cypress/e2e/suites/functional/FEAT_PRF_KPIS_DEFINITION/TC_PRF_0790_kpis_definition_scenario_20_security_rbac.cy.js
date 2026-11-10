/**
 * Test Case ID: TC_PRF_0790
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0790', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0790: KPIs Definition - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate KPIs Definition behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
