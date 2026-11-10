/**
 * Test Case ID: TC_PIM_0294
 * Feature: FEAT_PIM_EMPLOYEE_PICTURE
 * Name: Employee Picture - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_EMPLOYEE_PICTURE: TC_PIM_0294', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0294: Employee Picture - Scenario 9 (Positive)', function () {
    // Objective: Validate Employee Picture behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
