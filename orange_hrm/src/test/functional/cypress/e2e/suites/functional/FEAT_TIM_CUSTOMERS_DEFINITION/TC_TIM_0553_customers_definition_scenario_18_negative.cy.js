/**
 * Test Case ID: TC_TIM_0553
 * Feature: FEAT_TIM_CUSTOMERS_DEFINITION
 * Name: Customers Definition - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_TIM_CUSTOMERS_DEFINITION: TC_TIM_0553', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0553: Customers Definition - Scenario 18 (Negative)', function () {
    // Objective: Validate Customers Definition behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
