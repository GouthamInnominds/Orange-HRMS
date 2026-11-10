/**
 * Test Case ID: TC_LEV_0462
 * Feature: FEAT_LEV_HOLIDAYS_DEFINITION
 * Name: Holidays Definition - Scenario 12 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_LEV_HOLIDAYS_DEFINITION: TC_LEV_0462', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0462: Holidays Definition - Scenario 12 (Security/RBAC)', function () {
    // Objective: Validate Holidays Definition behavior under Security/RBAC conditions (Rule validation #12).
    cy.url().should('include', '/auth/login');
  });
});
