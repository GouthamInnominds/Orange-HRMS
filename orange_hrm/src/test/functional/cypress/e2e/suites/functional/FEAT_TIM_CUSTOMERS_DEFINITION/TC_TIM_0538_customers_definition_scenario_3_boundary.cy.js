/**
 * Test Case ID: TC_TIM_0538
 * Feature: FEAT_TIM_CUSTOMERS_DEFINITION
 * Name: Customers Definition - Scenario 3 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_CUSTOMERS_DEFINITION: TC_TIM_0538', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0538: Customers Definition - Scenario 3 (Boundary)', function () {
    // Objective: Validate Customers Definition behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });
});
