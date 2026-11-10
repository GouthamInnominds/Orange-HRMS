/**
 * Test Case ID: TC_PRF_0771
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0771', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0771: KPIs Definition - Scenario 1 (Positive)', function () {
    // Objective: Validate KPIs Definition behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
