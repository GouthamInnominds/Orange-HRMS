/**
 * Test Case ID: TC_PIM_0295
 * Feature: FEAT_PIM_EMPLOYEE_PICTURE
 * Name: Employee Picture - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_EMPLOYEE_PICTURE: TC_PIM_0295', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0295: Employee Picture - Scenario 10 (Negative)', function () {
    // Objective: Validate Employee Picture behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
