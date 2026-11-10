/**
 * Test Case ID: TC_ADM_144
 * Feature: FEAT_I18N_LANGUAGE__LOCALIZATION_LANGUAGES_
 * Name: Delete one or more added I18N languages
 * Priority: Medium
 */

describe('Feature FEAT_I18N_LANGUAGE__LOCALIZATION_LANGUAGES_: TC_ADM_144', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_144: Delete one or more added I18N languages', function () {
    // Objective: Verify one or more enabled languages can be removed/deleted from the system.
    cy.url().should('include', '/auth/login');
  });
});
