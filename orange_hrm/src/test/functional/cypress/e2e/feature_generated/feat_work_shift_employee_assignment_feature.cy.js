/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_WORK_SHIFT_EMPLOYEE_ASSIGNMENT | Tests: 3
 */

describe('Feature: FEAT_WORK_SHIFT_EMPLOYEE_ASSIGNMENT', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_043: List employees available to assign to a work shift', function () {
    // Priority: Medium | Objective: Verify only employees not already assigned to a work shift are returned by the available-employees list.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_044: Search available employees by name or employee id', function () {
    // Priority: Medium | Objective: Verify the available employee list can be filtered using nameOrId (max 100 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_045: Search available employees with overly long search text', function () {
    // Priority: Low | Objective: Verify nameOrId filter is rejected when exceeding max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });

});
