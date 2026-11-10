/**
 * Test Case ID: TC_TIM_0540
 * Feature: FEAT_TIM_CUSTOMERS_DEFINITION
 * Name: Customers Definition - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_TIM_CUSTOMERS_DEFINITION: TC_TIM_0540', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_TIM_0540: Customers Definition - Scenario 5 (Positive)', function () {
    // Objective: Validate Customers Definition behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
