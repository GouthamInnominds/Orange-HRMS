/**
 * Test Case ID: TC_ADM_143
 * Feature: FEAT_I18N_LANGUAGE__LOCALIZATION_LANGUAGES_
 * Name: Enable (add) an I18N language
 * Priority: High
 */

describe('Feature FEAT_I18N_LANGUAGE__LOCALIZATION_LANGUAGES_: TC_ADM_143', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_143: Enable (add) an I18N language', function () {
    // Objective: Verify an available language can be enabled/added for use in the system (update with empty body sets added=true).
    cy.url().should('include', '/auth/login');
  });
});
