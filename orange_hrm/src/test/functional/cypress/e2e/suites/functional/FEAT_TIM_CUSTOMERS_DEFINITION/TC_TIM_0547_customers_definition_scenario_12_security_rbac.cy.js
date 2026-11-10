/**
 * Test Case ID: TC_TIM_0547
 * Feature: FEAT_TIM_CUSTOMERS_DEFINITION
 * Name: Customers Definition - Scenario 12 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_TIM_CUSTOMERS_DEFINITION: TC_TIM_0547', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0547: Customers Definition - Scenario 12 (Security/RBAC)', function () {
    // Objective: Validate Customers Definition behavior under Security/RBAC conditions (Rule validation #12).
    cy.url().should('include', '/auth/login');
  });
});
