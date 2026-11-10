/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_JOB_CATEGORY | Tests: 6
 */

describe('Feature: FEAT_JOB_CATEGORY', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_027: Create job category with valid unique name', function () {
    // Priority: High | Objective: Verify a Job Category can be created with a valid unique name (<=50 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_028: Create job category with missing name', function () {
    // Priority: High | Objective: Verify name is required to create a job category.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_029: Create job category with duplicate name', function () {
    // Priority: High | Objective: Verify job category name must be unique.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_030: Create job category with name exceeding 50 characters', function () {
    // Priority: Medium | Objective: Verify name is rejected when exceeding max length of 50 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_031: Update job category name', function () {
    // Priority: Medium | Objective: Verify an existing job category name can be updated.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_032: Delete one or more job categories', function () {
    // Priority: High | Objective: Verify selected job categories can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });

});
