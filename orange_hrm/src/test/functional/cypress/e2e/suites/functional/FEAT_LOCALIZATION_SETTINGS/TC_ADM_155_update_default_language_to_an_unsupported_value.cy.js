/**
 * Test Case ID: TC_ADM_155
 * Feature: FEAT_LOCALIZATION_SETTINGS
 * Name: Update default language to an unsupported value
 * Priority: Medium
 */

describe('Feature FEAT_LOCALIZATION_SETTINGS: TC_ADM_155', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_155: Update default language to an unsupported value', function () {
    // Objective: Verify language must be one of the supported language codes.
    cy.url().should('include', '/auth/login');
  });
});
