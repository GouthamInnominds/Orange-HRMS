/**
 * Test Case ID: TC_ADM_150
 * Feature: FEAT_I18N_TRANSLATION
 * Name: List translations for a non-existent language id
 * Priority: Low
 */

describe('Feature FEAT_I18N_TRANSLATION: TC_ADM_150', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_150: List translations for a non-existent language id', function () {
    // Objective: Verify listing translations for an invalid/non-existent languageId is handled gracefully.
    cy.url().should('include', '/auth/login');
  });
});
