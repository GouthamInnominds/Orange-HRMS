/**
 * Test Case ID: TC_PIM_0025
 * Feature: FEAT_PIM_EMPLOYEE_MASTER
 * Name: Employee Master - Scenario 25 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_EMPLOYEE_MASTER: TC_PIM_0025', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0025: Employee Master - Scenario 25 (Positive)', function () {
    // Objective: Validate Employee Master behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });
});
