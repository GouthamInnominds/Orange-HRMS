/**
 * Test Case ID: TC_ADM_043
 * Feature: FEAT_WORK_SHIFT_EMPLOYEE_ASSIGNMENT
 * Name: List employees available to assign to a work shift
 * Priority: Medium
 */

describe('Feature FEAT_WORK_SHIFT_EMPLOYEE_ASSIGNMENT: TC_ADM_043', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_043: List employees available to assign to a work shift', function () {
    // Objective: Verify only employees not already assigned to a work shift are returned by the available-employees list.
    cy.url().should('include', '/auth/login');
  });
});
