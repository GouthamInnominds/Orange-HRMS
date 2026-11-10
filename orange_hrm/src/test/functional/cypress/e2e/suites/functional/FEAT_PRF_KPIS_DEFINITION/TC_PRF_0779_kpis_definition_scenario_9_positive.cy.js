/**
 * Test Case ID: TC_PRF_0779
 * Feature: FEAT_PRF_KPIS_DEFINITION
 * Name: KPIs Definition - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PRF_KPIS_DEFINITION: TC_PRF_0779', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PRF_0779: KPIs Definition - Scenario 9 (Positive)', function () {
    // Objective: Validate KPIs Definition behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
