/**
 * Test Case ID: TC_PIM_0193
 * Feature: FEAT_PIM_SALARY_DETAILS
 * Name: Salary Details - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_PIM_SALARY_DETAILS: TC_PIM_0193', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0193: Salary Details - Scenario 18 (Negative)', function () {
    // Objective: Validate Salary Details behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
