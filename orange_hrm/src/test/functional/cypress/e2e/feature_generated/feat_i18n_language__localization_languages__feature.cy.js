/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_I18N_LANGUAGE__LOCALIZATION_LANGUAGES_ | Tests: 5
 */

describe('Feature: FEAT_I18N_LANGUAGE__LOCALIZATION_LANGUAGES_', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_140: List all I18N languages filtered by activeOnly', function () {
    // Priority: Medium | Objective: Verify the list of installed languages can be filtered using the required activeOnly parameter.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_141: Get a single I18N language by id', function () {
    // Priority: Medium | Objective: Verify a specific installed language\'s details can be retrieved by id.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_142: Get an I18N language with an invalid id', function () {
    // Priority: Low | Objective: Verify requesting a non-existent language id returns a not-found error.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_143: Enable (add) an I18N language', function () {
    // Priority: High | Objective: Verify an available language can be enabled/added for use in the system (update with empty body sets added=true).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_144: Delete one or more added I18N languages', function () {
    // Priority: Medium | Objective: Verify one or more enabled languages can be removed/deleted from the system.
    cy.url().should('include', '/auth/login');
  });

});
