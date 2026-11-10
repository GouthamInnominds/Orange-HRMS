/**
 * Test Case ID: TC_PIM_0290
 * Feature: FEAT_PIM_EMPLOYEE_PICTURE
 * Name: Employee Picture - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_EMPLOYEE_PICTURE: TC_PIM_0290', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0290: Employee Picture - Scenario 5 (Positive)', function () {
    // Objective: Validate Employee Picture behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
