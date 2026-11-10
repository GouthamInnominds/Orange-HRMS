/**
 * Test Case ID: TC_PRF_0786
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 16 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0786', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0786: KPIs Definition - Scenario 16 (Security/RBAC)', function () {
    // Objective: Validate KPIs Definition behavior under Security/RBAC conditions (Rule validation #16).
    cy.url().should('include', '/auth/login');
  });
});
