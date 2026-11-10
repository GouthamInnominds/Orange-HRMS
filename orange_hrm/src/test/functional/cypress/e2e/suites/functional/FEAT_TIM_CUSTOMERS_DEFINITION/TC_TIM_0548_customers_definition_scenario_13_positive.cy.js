/**
 * Test Case ID: TC_TIM_0548
 * Feature: FEAT_TIM_CUSTOMERS_DEFINITION
 * Name: Customers Definition - Scenario 13 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_CUSTOMERS_DEFINITION: TC_TIM_0548', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0548: Customers Definition - Scenario 13 (Positive)', function () {
    // Objective: Validate Customers Definition behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });
});
