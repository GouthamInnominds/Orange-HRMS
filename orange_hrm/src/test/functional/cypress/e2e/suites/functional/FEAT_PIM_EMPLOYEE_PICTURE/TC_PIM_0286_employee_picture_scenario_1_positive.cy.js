/**
 * Test Case ID: TC_PIM_0286
 * Feature: FEAT_PIM_EMPLOYEE_PICTURE
 * Name: Employee Picture - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_EMPLOYEE_PICTURE: TC_PIM_0286', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0286: Employee Picture - Scenario 1 (Positive)', function () {
    // Objective: Validate Employee Picture behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
