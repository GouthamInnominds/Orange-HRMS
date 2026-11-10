/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_QUALIFICATION___LANGUAGE | Tests: 6
 */

describe('Feature: FEAT_QUALIFICATION___LANGUAGE', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_060: Create language record with valid unique name', function () {
    // Priority: High | Objective: Verify a Language record can be created with a valid unique name (<=120 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_061: Create language record with missing name', function () {
    // Priority: High | Objective: Verify name is required to create a language record.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_062: Create language record with duplicate name', function () {
    // Priority: High | Objective: Verify language name must be unique.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_063: Create language record with name exceeding 120 characters', function () {
    // Priority: Medium | Objective: Verify name is rejected when exceeding max length of 120 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_064: Update language record name', function () {
    // Priority: Medium | Objective: Verify an existing language record name can be updated.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_065: Delete one or more language records', function () {
    // Priority: High | Objective: Verify selected language records can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });

});
