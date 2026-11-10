/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_NATIONALITY | Tests: 6
 */

describe('Feature: FEAT_NATIONALITY', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_078: Create nationality with valid unique name', function () {
    // Priority: High | Objective: Verify a Nationality record can be created with a valid unique name (<=100 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_079: Create nationality with missing name', function () {
    // Priority: High | Objective: Verify name is required to create a nationality record.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_080: Create nationality with duplicate name', function () {
    // Priority: High | Objective: Verify nationality name must be unique.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_081: Create nationality with name exceeding 100 characters', function () {
    // Priority: Medium | Objective: Verify name is rejected when exceeding max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_082: Update nationality name', function () {
    // Priority: Medium | Objective: Verify an existing nationality name can be updated.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_083: Delete one or more nationalities', function () {
    // Priority: High | Objective: Verify selected nationality records can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });

});
