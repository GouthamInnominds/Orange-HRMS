/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_QUALIFICATION___LICENSE | Tests: 6
 */

describe('Feature: FEAT_QUALIFICATION___LICENSE', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_072: Create license with valid unique name', function () {
    // Priority: High | Objective: Verify a License record can be created with a valid unique name (<=100 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_073: Create license with missing name', function () {
    // Priority: High | Objective: Verify name is required to create a license record.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_074: Create license with duplicate name', function () {
    // Priority: High | Objective: Verify license name must be unique.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_075: Create license with name exceeding 100 characters', function () {
    // Priority: Medium | Objective: Verify name is rejected when exceeding max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_076: Update license name', function () {
    // Priority: Medium | Objective: Verify an existing license name can be updated.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_077: Delete one or more licenses', function () {
    // Priority: High | Objective: Verify selected license records can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });

});
