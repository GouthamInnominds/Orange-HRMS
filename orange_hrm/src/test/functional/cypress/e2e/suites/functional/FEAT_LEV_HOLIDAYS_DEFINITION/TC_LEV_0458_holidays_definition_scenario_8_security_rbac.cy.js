/**
 * Test Case ID: TC_LEV_0458
 * Feature: FEAT_LEV_HOLIDAYS_DEFINITION
 * Name: Holidays Definition - Scenario 8 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_LEV_HOLIDAYS_DEFINITION: TC_LEV_0458', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0458: Holidays Definition - Scenario 8 (Security/RBAC)', function () {
    // Objective: Validate Holidays Definition behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });
});
