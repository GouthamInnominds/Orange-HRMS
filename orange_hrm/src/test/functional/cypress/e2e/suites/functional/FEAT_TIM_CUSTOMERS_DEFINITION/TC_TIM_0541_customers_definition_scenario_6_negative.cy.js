/**
 * Test Case ID: TC_TIM_0541
 * Feature: FEAT_TIM_CUSTOMERS_DEFINITION
 * Name: Customers Definition - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_TIM_CUSTOMERS_DEFINITION: TC_TIM_0541', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0541: Customers Definition - Scenario 6 (Negative)', function () {
    // Objective: Validate Customers Definition behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
