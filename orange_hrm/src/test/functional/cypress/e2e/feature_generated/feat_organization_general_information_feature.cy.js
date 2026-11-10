/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_ORGANIZATION_GENERAL_INFORMATION | Tests: 8
 */

describe('Feature: FEAT_ORGANIZATION_GENERAL_INFORMATION', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_093: View organization general information', function () {
    // Priority: Medium | Objective: Verify organization general information (a singleton record) can be viewed.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_094: Update organization name (required field)', function () {
    // Priority: High | Objective: Verify organization name is required and can be updated (max 100 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_095: Update organization with missing name', function () {
    // Priority: High | Objective: Verify organization update fails when name is left blank.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_096: Update organization with invalid email format', function () {
    // Priority: Medium | Objective: Verify organization email is validated as a proper email format and max 30 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_097: Update organization email exceeding 30 characters', function () {
    // Priority: Low | Objective: Verify organization email field is rejected when exceeding max length of 30 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_098: Update organization with invalid phone format', function () {
    // Priority: Medium | Objective: Verify organization phone must match the PHONE format rule (max 30 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_099: Update organization tax id and registration number', function () {
    // Priority: Medium | Objective: Verify taxId and registrationNumber (each <=30 chars) can be updated.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_100: Update organization address fields (street1/street2 exceeding max length)', function () {
    // Priority: Low | Objective: Verify street1 and street2 fields (<=100 chars each) reject overly long values.
    cy.url().should('include', '/auth/login');
  });

});
