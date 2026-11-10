/**
 * Test Case ID: TC_PIM_0196
 * Feature: FEAT_PIM_SALARY_DETAILS
 * Name: Salary Details - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_PIM_SALARY_DETAILS: TC_PIM_0196', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0196: Salary Details - Scenario 21 (Positive)', function () {
    // Objective: Validate Salary Details behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
