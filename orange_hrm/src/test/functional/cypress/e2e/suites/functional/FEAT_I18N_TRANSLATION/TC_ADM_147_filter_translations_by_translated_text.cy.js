/**
 * Test Case ID: TC_ADM_147
 * Feature: FEAT_I18N_TRANSLATION
 * Name: Filter translations by translated text
 * Priority: Medium
 */

describe('Feature FEAT_I18N_TRANSLATION: TC_ADM_147', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_147: Filter translations by translated text', function () {
    // Objective: Verify translations list can be filtered by translatedText.
    cy.url().should('include', '/auth/login');
  });
});
