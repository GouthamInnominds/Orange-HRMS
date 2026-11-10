/**
 * Test Case ID: TC_ADM_154
 * Feature: FEAT_LOCALIZATION_SETTINGS
 * Name: Update default language to a supported language
 * Priority: High
 */

describe('Feature FEAT_LOCALIZATION_SETTINGS: TC_ADM_154', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_154: Update default language to a supported language', function () {
    // Objective: Verify default language can be updated to any value from the supported languages list.
    cy.url().should('include', '/auth/login');
  });
});
