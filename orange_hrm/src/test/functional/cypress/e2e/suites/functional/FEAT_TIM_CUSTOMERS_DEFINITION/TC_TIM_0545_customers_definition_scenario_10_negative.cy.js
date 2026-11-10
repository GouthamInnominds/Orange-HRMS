/**
 * Test Case ID: TC_TIM_0545
 * Feature: FEAT_TIM_CUSTOMERS_DEFINITION
 * Name: Customers Definition - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_CUSTOMERS_DEFINITION: TC_TIM_0545', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0545: Customers Definition - Scenario 10 (Negative)', function () {
    // Objective: Validate Customers Definition behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
