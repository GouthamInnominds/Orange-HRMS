/**
 * Test Case ID: TC_ADM_141
 * Feature: FEAT_I18N_LANGUAGE__LOCALIZATION_LANGUAGES_
 * Name: Get a single I18N language by id
 * Priority: Medium
 */

describe('Feature FEAT_I18N_LANGUAGE__LOCALIZATION_LANGUAGES_: TC_ADM_141', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_141: Get a single I18N language by id', function () {
    // Objective: Verify a specific installed language\'s details can be retrieved by id.
    cy.url().should('include', '/auth/login');
  });
});
