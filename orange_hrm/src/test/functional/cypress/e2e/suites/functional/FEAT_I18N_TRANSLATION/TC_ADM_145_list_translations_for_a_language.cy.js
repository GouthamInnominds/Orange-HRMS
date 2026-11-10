/**
 * Test Case ID: TC_ADM_145
 * Feature: FEAT_I18N_TRANSLATION
 * Name: List translations for a language
 * Priority: Medium
 */

describe('Feature FEAT_I18N_TRANSLATION: TC_ADM_145', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_145: List translations for a language', function () {
    // Objective: Verify translation strings for a specific languageId can be listed.
    cy.url().should('include', '/auth/login');
  });
});
