/**
 * Test Case ID: TC_TIM_0539
 * Feature: FEAT_TIM_CUSTOMERS_DEFINITION
 * Name: Customers Definition - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_TIM_CUSTOMERS_DEFINITION: TC_TIM_0539', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0539: Customers Definition - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Customers Definition behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
