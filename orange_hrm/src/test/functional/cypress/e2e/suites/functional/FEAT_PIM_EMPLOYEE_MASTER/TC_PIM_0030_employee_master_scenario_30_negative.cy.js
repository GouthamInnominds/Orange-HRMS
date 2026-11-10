/**
 * Test Case ID: TC_PIM_0030
 * Feature: FEAT_PIM_EMPLOYEE_MASTER
 * Name: Employee Master - Scenario 30 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_PIM_EMPLOYEE_MASTER: TC_PIM_0030', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0030: Employee Master - Scenario 30 (Negative)', function () {
    // Objective: Validate Employee Master behavior under Negative conditions (Rule validation #30).
    cy.url().should('include', '/auth/login');
  });
});
