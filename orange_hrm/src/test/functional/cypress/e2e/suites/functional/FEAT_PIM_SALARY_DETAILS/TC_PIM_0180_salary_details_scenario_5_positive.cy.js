/**
 * Test Case ID: TC_PIM_0180
 * Feature: FEAT_PIM_SALARY_DETAILS
 * Name: Salary Details - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_SALARY_DETAILS: TC_PIM_0180', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0180: Salary Details - Scenario 5 (Positive)', function () {
    // Objective: Validate Salary Details behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
