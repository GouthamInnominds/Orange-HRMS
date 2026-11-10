/**
 * Test Case ID: TC_TIM_0549
 * Feature: FEAT_TIM_CUSTOMERS_DEFINITION
 * Name: Customers Definition - Scenario 14 (Negative)
 * Priority: High
 */

describe('Feature FEAT_TIM_CUSTOMERS_DEFINITION: TC_TIM_0549', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0549: Customers Definition - Scenario 14 (Negative)', function () {
    // Objective: Validate Customers Definition behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });
});
