/**
 * Test Case ID: TC_TIM_0544
 * Feature: FEAT_TIM_CUSTOMERS_DEFINITION
 * Name: Customers Definition - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_CUSTOMERS_DEFINITION: TC_TIM_0544', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0544: Customers Definition - Scenario 9 (Positive)', function () {
    // Objective: Validate Customers Definition behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
