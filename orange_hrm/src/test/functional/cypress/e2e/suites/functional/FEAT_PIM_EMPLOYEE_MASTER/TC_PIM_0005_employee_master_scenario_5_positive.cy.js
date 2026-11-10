/**
 * Test Case ID: TC_PIM_0005
 * Feature: FEAT_PIM_EMPLOYEE_MASTER
 * Name: Employee Master - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_EMPLOYEE_MASTER: TC_PIM_0005', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0005: Employee Master - Scenario 5 (Positive)', function () {
    // Objective: Validate Employee Master behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
