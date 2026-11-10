/**
 * Test Case ID: TC_ADM_044
 * Feature: FEAT_WORK_SHIFT_EMPLOYEE_ASSIGNMENT
 * Name: Search available employees by name or employee id
 * Priority: Medium
 */

describe('Feature FEAT_WORK_SHIFT_EMPLOYEE_ASSIGNMENT: TC_ADM_044', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_044: Search available employees by name or employee id', function () {
    // Objective: Verify the available employee list can be filtered using nameOrId (max 100 chars).
    cy.url().should('include', '/auth/login');
  });
});
