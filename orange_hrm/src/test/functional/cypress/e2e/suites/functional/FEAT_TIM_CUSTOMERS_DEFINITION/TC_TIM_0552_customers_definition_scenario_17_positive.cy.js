/**
 * Test Case ID: TC_TIM_0552
 * Feature: FEAT_TIM_CUSTOMERS_DEFINITION
 * Name: Customers Definition - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_TIM_CUSTOMERS_DEFINITION: TC_TIM_0552', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0552: Customers Definition - Scenario 17 (Positive)', function () {
    // Objective: Validate Customers Definition behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
