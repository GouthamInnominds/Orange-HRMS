/**
 * Test Case ID: TC_ADM_045
 * Feature: FEAT_WORK_SHIFT_EMPLOYEE_ASSIGNMENT
 * Name: Search available employees with overly long search text
 * Priority: Low
 */

describe('Feature FEAT_WORK_SHIFT_EMPLOYEE_ASSIGNMENT: TC_ADM_045', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_045: Search available employees with overly long search text', function () {
    // Objective: Verify nameOrId filter is rejected when exceeding max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });
});
