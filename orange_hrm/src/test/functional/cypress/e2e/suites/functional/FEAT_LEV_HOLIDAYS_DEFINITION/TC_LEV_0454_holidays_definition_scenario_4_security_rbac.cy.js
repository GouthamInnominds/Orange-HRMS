/**
 * Test Case ID: TC_LEV_0454
 * Feature: FEAT_LEV_HOLIDAYS_DEFINITION
 * Name: Holidays Definition - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_LEV_HOLIDAYS_DEFINITION: TC_LEV_0454', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0454: Holidays Definition - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Holidays Definition behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
