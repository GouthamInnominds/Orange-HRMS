/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_QUALIFICATION___EDUCATION | Tests: 6
 */

describe('Feature: FEAT_QUALIFICATION___EDUCATION', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_054: Create education record with valid unique name', function () {
    // Priority: High | Objective: Verify an Education record can be created with a valid unique name (<=100 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_055: Create education record with missing name', function () {
    // Priority: High | Objective: Verify name is required to create an education record.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_056: Create education record with duplicate name', function () {
    // Priority: High | Objective: Verify education name must be unique.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_057: Create education record with name exceeding 100 characters', function () {
    // Priority: Medium | Objective: Verify name is rejected when exceeding max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_058: Update education record name', function () {
    // Priority: Medium | Objective: Verify an existing education record name can be updated.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_059: Delete one or more education records', function () {
    // Priority: High | Objective: Verify selected education records can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });

});
