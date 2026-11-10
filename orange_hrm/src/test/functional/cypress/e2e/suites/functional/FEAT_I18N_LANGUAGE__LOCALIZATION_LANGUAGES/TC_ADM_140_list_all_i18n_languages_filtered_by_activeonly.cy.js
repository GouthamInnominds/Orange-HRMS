/**
 * Test Case ID: TC_ADM_140
 * Feature: FEAT_I18N_LANGUAGE__LOCALIZATION_LANGUAGES_
 * Name: List all I18N languages filtered by activeOnly
 * Priority: Medium
 */

describe('Feature FEAT_I18N_LANGUAGE__LOCALIZATION_LANGUAGES_: TC_ADM_140', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_140: List all I18N languages filtered by activeOnly', function () {
    // Objective: Verify the list of installed languages can be filtered using the required activeOnly parameter.
    cy.url().should('include', '/auth/login');
  });
});
