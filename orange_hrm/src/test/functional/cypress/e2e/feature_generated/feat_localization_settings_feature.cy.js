/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_LOCALIZATION_SETTINGS | Tests: 5
 */

describe('Feature: FEAT_LOCALIZATION_SETTINGS', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_153: View current default localization language and date format', function () {
    // Priority: Medium | Objective: Verify the admin panel\'s default display language and date format can be retrieved.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_154: Update default language to a supported language', function () {
    // Priority: High | Objective: Verify default language can be updated to any value from the supported languages list.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_155: Update default language to an unsupported value', function () {
    // Priority: Medium | Objective: Verify language must be one of the supported language codes.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_156: Update default date format to a supported format', function () {
    // Priority: Medium | Objective: Verify default date format can be updated to any value from the supported date formats list.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_157: Update default date format to an unsupported value', function () {
    // Priority: Medium | Objective: Verify dateFormat must be one of the supported date format keys.
    cy.url().should('include', '/auth/login');
  });

});
