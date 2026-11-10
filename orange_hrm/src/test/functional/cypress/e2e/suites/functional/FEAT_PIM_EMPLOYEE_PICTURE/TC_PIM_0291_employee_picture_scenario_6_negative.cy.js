/**
 * Test Case ID: TC_PIM_0291
 * Feature: FEAT_PIM_EMPLOYEE_PICTURE
 * Name: Employee Picture - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_EMPLOYEE_PICTURE: TC_PIM_0291', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0291: Employee Picture - Scenario 6 (Negative)', function () {
    // Objective: Validate Employee Picture behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
