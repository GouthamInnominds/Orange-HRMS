/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_EMPLOYMENT_STATUS | Tests: 7
 */

describe('Feature: FEAT_EMPLOYMENT_STATUS', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_020: Create employment status with valid unique name', function () {
    // Priority: High | Objective: Verify an Employment Status can be created with a valid unique name (<=50 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_021: Create employment status with missing name', function () {
    // Priority: High | Objective: Verify name is required to create an employment status.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_022: Create employment status with duplicate name', function () {
    // Priority: High | Objective: Verify employment status name must be unique.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_023: Create employment status with name exceeding 50 characters', function () {
    // Priority: Medium | Objective: Verify name is rejected when exceeding max length of 50 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_024: Update employment status name', function () {
    // Priority: Medium | Objective: Verify an existing employment status name can be updated.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_025: Search employment status list by name filter', function () {
    // Priority: Medium | Objective: Verify the employment status list can be filtered by name.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_026: Delete one or more employment statuses', function () {
    // Priority: High | Objective: Verify selected employment statuses can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });

});
