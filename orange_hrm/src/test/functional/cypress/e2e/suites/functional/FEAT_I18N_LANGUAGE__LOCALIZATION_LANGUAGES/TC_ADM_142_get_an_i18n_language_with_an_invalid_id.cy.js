/**
 * Test Case ID: TC_ADM_142
 * Feature: FEAT_I18N_LANGUAGE__LOCALIZATION_LANGUAGES_
 * Name: Get an I18N language with an invalid id
 * Priority: Low
 */

describe('Feature FEAT_I18N_LANGUAGE__LOCALIZATION_LANGUAGES_: TC_ADM_142', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_142: Get an I18N language with an invalid id', function () {
    // Objective: Verify requesting a non-existent language id returns a not-found error.
    cy.url().should('include', '/auth/login');
  });
});
